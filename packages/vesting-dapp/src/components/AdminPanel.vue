<template>
  <div>
    <v-card elevation="2" :loading="loading">
      <v-card-title>Admin Panel</v-card-title>
      <v-alert type="success" dismissible v-if="alerts.success.show">
        {{ alerts.success.message }}
      </v-alert>
      <v-alert type="error" dismissible v-if="alerts.error.show">
        {{ alerts.error.message }}
      </v-alert>
      <v-dialog
        v-model="displayFetchingDataDialog"
        hide-overlay
        persistent
        width="300"
      >
        <v-card color="primary" dark>
          <v-card-text>
            Fetching on chain data
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="light-blue darken-4" dark class="mx-2">
            <v-card-title> Owner Balance</v-card-title>
            <v-card-text>
              <v-chip class="ma-2" text-color="white" large>
                {{ data.ownerBalance }} $ {{ erc20.symbol }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="teal darken-4" dark class="mx-2">
            <v-card-title> Vesting Contract Balance</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-chip class="ma-2" text-color="white" large>
                    {{ data.vestingContractBalance }} $ {{ erc20.symbol }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    type="number"
                    v-model="form.amountToFund"
                    label="Amount"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn class="mt-4" @click="fund">Fund</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { toEth } from "../services/utils";
import { ethers } from "ethers";

export default {
  name: "AdminPanel",
  data: () => ({
    loading: false,
    fetchingDataCompleted: false,
    alerts: {
      success: {
        show: false,
        message: "",
      },
      error: {
        show: false,
        message: "",
      },
    },
    valid: false,
    form: {
      amountToFund: 0,
    },
    data: {
      ownerBalance: 0,
      ownerBalanceWei: 0,
      vestingContractBalance: 0,
      vestingContractBalanceWei: 0,
    },
  }),
  methods: {
    onSuccess(receipt) {
      console.log("onSuccess: ", receipt);
      this.stopLoading();
      this.showSuccess("Transaction executed.");
      this.loadData();
    },
    onError(error) {
      console.error("onError: ", error);
      this.stopLoading();
      this.showError("Cannot execute transaction, see logs for more.");
    },
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
    showSuccess(message) {
      this.alerts.success.message = message;
      this.alerts.success.show = true;
    },
    showError(message) {
      this.alerts.error.message = message;
      this.alerts.error.show = true;
    },
    async loadData() {
      console.log("loading data");
      this.fetchingDataCompleted = false;
      this.data.ownerBalanceWei = await this.erc20.contract.methods
        .balanceOf(window.ethereum.selectedAddress)
        .call();
      this.data.ownerBalance = toEth(this.data.ownerBalanceWei);
      this.data.vestingContractBalanceWei = await this.erc20.contract.methods
        .balanceOf(this.globalConfig.tokenVestingContractAddress)
        .call();
      this.data.vestingContractBalance = toEth(
        this.data.vestingContractBalanceWei
      );
      this.fetchingDataCompleted = true;
    },
    fund() {
      const amount = ethers.utils
        .parseUnits(this.form.amountToFund, "ether")
        .toString();
      this.erc20.contract.methods
        .transfer(this.globalConfig.tokenVestingContractAddress, amount)
        .send({ from: window.ethereum.selectedAddress })
        .on("receipt", this.onSuccess)
        .on("error", this.onError);
    },
  },
  async mounted() {
    if (!this.isOwner) {
      this.showError("Connected user is not the owner.");
    } else {
      await this.loadData();
    }
  },
  computed: {
    symbolSuffix() {
      return `$${this.erc20.symbol}`;
    },
    displayFetchingDataDialog() {
      return !this.fetchingDataCompleted;
    },
    ...mapState(["web3", "tokenVesting", "erc20", "isOwner", "globalConfig"]),
  },
};
</script>

<style scoped></style>
