<template>
  <div>
    <v-card elevation="2" :loading="loading">
      <v-card-title>New Vesting Schedule</v-card-title>
      <v-alert type="success" dismissible v-if="alerts.success.show">
        {{ alerts.success.message }}
      </v-alert>
      <v-alert type="error" dismissible v-if="alerts.error.show">
        {{ alerts.error.message }}
      </v-alert>
      <v-form v-model="valid">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.erc20Address"
                :rules="ethereumAddressRules"
                label="ERC20 Address"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="4">
              <v-btn color="primary" @click="deployVestingContract"
                >Deploy Vesting Contract
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-dialog v-model="contractDeployedDialog" width="500">
      <v-card v-if="contractDeployedAddress !== null" dark>
        <v-card-title>Contract Deployed</v-card-title>
        <v-card-text>
          <v-text-field
            id="input"
            type="text"
            v-model="contractDeployedAddress"
          />
          <v-icon @click="copyDeployedAddress">mdi-content-copy</v-icon>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="contractDeployedDialog = false">Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DeployVestingContract",
  data: () => ({
    loading: false,
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
      erc20Address: null,
    },
    ethereumAddressRules: [
      (v) => !!v || "Ethereum address is required",
      (v) =>
        /^(0x)?[0-9a-fA-F]{40}$/.test(v) || "Ethereum address must be valid",
    ],
    contractDeployedDialog: false,
    contractDeployedAddress: null,
  }),
  methods: {
    deployVestingContract() {
      this.startLoading();
      const contract = new this.web3.eth.Contract(
        this.globalConfig.tokenVestingContractAbi,
        null
      );
      contract
        .deploy({
          data: this.globalConfig.tokenVestingContractBytecode,
          arguments: [this.form.erc20Address],
        })
        .send({
          from: window.ethereum.selectedAddress,
        })
        .on("error", this.onError)
        .on("receipt", this.onSuccess);
    },
    onSuccess(receipt) {
      console.log("onSuccess: ", receipt);
      this.stopLoading();
      this.contractDeployedAddress = receipt.contractAddress;
      this.contractDeployedDialog = true;
    },
    onError(error) {
      console.error("onError: ", error);
      this.stopLoading();
      this.showError("Cannot execute transaction, see logs for more.");
    },
    initForm() {
      this.contractDeployedDialog = false;
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
    copyDeployedAddress() {
      const copyText = document.querySelector("#input");
      copyText.select();
      document.execCommand("copy");
    },
  },
  async mounted() {
    this.initForm();
  },
  computed: {
    symbolSuffix() {
      return `$${this.erc20.symbol}`;
    },
    ...mapState(["web3", "tokenVesting", "erc20", "globalConfig"]),
  },
};
</script>

<style scoped></style>
