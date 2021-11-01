<template>
  <div>
    <v-card elevation="0" :loading="loading">
      <h2 class="mb-6">Vesting Schedules</h2>
      <v-alert type="success" dismissible v-if="alerts.success.show">
        {{ alerts.success.message }}
      </v-alert>
      <v-alert type="error" dismissible v-if="alerts.error.show">
        {{ alerts.error.message }}
      </v-alert>
      <v-data-table
        :headers="vestingSchedulesHeaders"
        :items="vestingSchedules"
        item-key="index"
        class="elevation-1"
        :loading="displayFetchingDataDialog"
        loading-text="Loading on chain data... Please wait"
      >
        <template v-slot:item.beneficiary="{ item }">
          <a @click="seeVestingSchedule(item)">{{ shortAddress(item.beneficiary) }}</a>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getColorForStatus(item.status)" dark>
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="seeVestingSchedule(item)"> mdi-magnify </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset</v-btn>
        </template>
      </v-data-table>
      <v-dialog
        v-model="detailsDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card v-if="selectedVestingSchedule !== null" :loading="detailsDialogLoading">
          <v-alert type="success" dismissible v-if="alerts.detailsDialog.success.show">
            {{ alerts.detailsDialog.success.message }}
          </v-alert>
          <v-alert type="error" dismissible v-if="alerts.detailsDialog.error.show">
            {{ alerts.detailsDialog.error.message }}
          </v-alert>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="detailsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Vesting Details</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="detailsDialog = false"> Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <div class="mx-auto mt-2" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">
                  <a @click="openBeneficiaryInExplorer(selectedVestingSchedule.beneficiary)">{{
                    selectedVestingSchedule.beneficiary
                  }}</a>
                </div>
                <v-list-item-title class="text-h5 mb-1">
                  {{ selectedVestingSchedule.amount }} ${{ erc20.symbol }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Vested from {{ selectedVestingSchedule.start }} to
                  {{ selectedVestingSchedule.end }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar
                tile
                rounded
                size="40"
                :color="getColorForStatus(selectedVestingSchedule.status)"
              >
                <v-icon dark x-large> mdi-account-box</v-icon>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Duration</v-card-title>
                    <v-card-title>{{ selectedVestingSchedule.duration }}</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Released</v-card-title>
                    <v-card-title>{{ selectedVestingSchedule.released }}</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Vested Total</v-card-title>
                    <v-card-title>{{ selectedVestingSchedule.vestedAmount }}</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Releasable</v-card-title>
                    <v-card-title>{{ selectedVestingSchedule.releasableAmount }}</v-card-title>
                    <v-card-text>
                      <v-row align="end">
                        <v-col cols="12" md="6">
                          <v-text-field
                            type="number"
                            v-model="amountToRelease"
                            hide-details
                            label="Amount"
                            outlined
                            dense
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-btn color="primary" class="mt-2" @click="claim">Claim</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Vested / Total</v-card-title>
                    <v-card-text>
                      <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="selectedVestingSchedule.vestedPercentage"
                        color="teal"
                      >
                        <strong>{{ Math.ceil(selectedVestingSchedule.vestedPercentage) }}%</strong>
                      </v-progress-circular>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Released / Total</v-card-title>
                    <v-card-text>
                      <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="selectedVestingSchedule.releasedOverTotalPercentage"
                        color="pink"
                      >
                        <strong
                          >{{
                            Math.ceil(selectedVestingSchedule.releasedOverTotalPercentage)
                          }}%</strong
                        >
                      </v-progress-circular>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-title>Released / Vested</v-card-title>
                    <v-card-text>
                      <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="selectedVestingSchedule.releasedOverVestedPercentage"
                        color="lime accent-2"
                      >
                        <strong
                          >{{
                            Math.ceil(selectedVestingSchedule.releasedOverVestedPercentage)
                          }}%</strong
                        >
                      </v-progress-circular>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="connectedUserIsOwner">
              <v-btn
                color="warning"
                outlined
                rounded
                text
                @click="revoke"
                :disabled="!selectedVestingSchedule.revocable"
              >
                Revoke
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="displayFetchingDataDialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Fetching on chain data
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { formatVestingSchedule } from "../services/vesting-schedule"
import { BigNumber, ethers } from "ethers"
import { truncateEthAddress } from "../services/utils"
export default {
  name: "VestingScheduleList",
  data: () => ({
    loading: false,
    detailsDialogLoading: false,
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
      detailsDialog: {
        success: {
          show: false,
          message: "",
        },
        error: {
          show: false,
          message: "",
        },
      },
    },
    detailsDialog: false,
    selectedVestingSchedule: null,
    vestingCount: 0,
    vestingSchedules: [],
    amountToRelease: 0,
    vestingSchedulesHeaders: [
      {
        text: "Beneficiary",
        align: "start",
        sortable: false,
        value: "beneficiary",
      },
      { text: "Amount", value: "amount", sortable: true },
      { text: "Start", value: "start", sortable: true },
      { text: "End", value: "end", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  methods: {
    async loadDataOwner() {
      this.fetchingDataCompleted = false
      this.vestingCount = await this.tokenVesting.methods.getVestingSchedulesCount().call()
      console.log(`Found ${this.vestingCount} vesting schedules.`)
      for (let i = 0; i < this.vestingCount; i++) {
        const vestingScheduleId = await this.tokenVesting.methods.getVestingIdAtIndex(i).call()
        const vestingScheduleRaw = await this.tokenVesting.methods
          .getVestingSchedule(vestingScheduleId)
          .call()
        let releasableAmount = 0
        if (!vestingScheduleRaw.revoked) {
          releasableAmount = await this.tokenVesting.methods
            .computeReleasableAmount(vestingScheduleId)
            .call()
        }
        const vestingScheduleWrapper = {}
        vestingScheduleWrapper.raw = vestingScheduleRaw
        vestingScheduleWrapper.vestingScheduleId = vestingScheduleId
        vestingScheduleWrapper.releasableAmount = BigNumber.from(releasableAmount)
        vestingScheduleWrapper.vestedAmount = BigNumber.from(releasableAmount).add(
          BigNumber.from(vestingScheduleRaw.released),
        )
        const vestingSchedule = formatVestingSchedule(vestingScheduleWrapper, i)
        this.vestingSchedules.push(vestingSchedule)
      }
      this.fetchingDataCompleted = true
    },
    async loadData() {
      this.fetchingDataCompleted = false
      this.vestingCount = await this.tokenVesting.methods
        .getVestingSchedulesCountByBeneficiary(window.ethereum.selectedAddress)
        .call()
      console.log(`Found ${this.vestingCount} vesting schedules for connected address.`)
      for (let i = 0; i < this.vestingCount; i++) {
        const vestingScheduleRaw = await this.tokenVesting.methods
          .getVestingScheduleByAddressAndIndex(window.ethereum.selectedAddress, i)
          .call()
        let releasableAmount = 0
        const vestingScheduleId = await this.tokenVesting.methods
          .computeVestingScheduleIdForAddressAndIndex(window.ethereum.selectedAddress, i)
          .call()
        if (!vestingScheduleRaw.revoked) {
          releasableAmount = await this.tokenVesting.methods
            .computeReleasableAmount(vestingScheduleId)
            .call()
        }
        const vestingScheduleWrapper = {}
        vestingScheduleWrapper.raw = vestingScheduleRaw
        vestingScheduleWrapper.vestingScheduleId = vestingScheduleId
        vestingScheduleWrapper.releasableAmount = BigNumber.from(releasableAmount)
        vestingScheduleWrapper.vestedAmount = BigNumber.from(releasableAmount).add(
          BigNumber.from(vestingScheduleRaw.released),
        )
        const vestingSchedule = formatVestingSchedule(vestingScheduleWrapper, i)
        this.vestingSchedules.push(vestingSchedule)
      }
      this.fetchingDataCompleted = true
    },
    seeVestingSchedule(vestingSchedule) {
      this.selectedVestingSchedule = vestingSchedule
      this.detailsDialog = true
    },
    async claim() {
      console.log(window.ethereum)
      this.startDetailsDialogLoading()
      const vestingScheduleId = this.selectedVestingSchedule.vestingScheduleId
      const amount = ethers.utils.parseUnits(this.amountToRelease, "ether").toString()
      await this.tokenVesting.methods
        .release(vestingScheduleId, amount)
        .send({
          from: window.ethereum.selectedAddress,
          chainId: 31337,
        })
        .on("receipt", this.onReleaseReceipt)
        .on("error", this.onReleaseError)
    },
    onReleaseReceipt(receipt) {
      console.log("onReleaseReceipt: ", receipt)
      this.stopDetailsDialogLoading()
      this.showDetailsDialogSuccess("Transaction executed.")
      this.amountToRelease = 0
    },
    onReleaseError(error) {
      console.error("onReleaseReceipt: ", error)
      this.stopDetailsDialogLoading()
      this.showDetailsDialogError("Cannot execute transaction, see logs for more.")
      this.amountToRelease = 0
    },
    async revoke() {
      this.startDetailsDialogLoading()
      const vestingScheduleId = this.selectedVestingSchedule.vestingScheduleId
      this.tokenVesting.methods
        .revoke(vestingScheduleId)
        .send({ from: window.ethereum.selectedAddress })
        .on("receipt", this.onRevokeReceipt)
        .on("error", this.onRevokeError)
    },
    onRevokeReceipt(receipt) {
      console.log("onReleaseReceipt: ", receipt)
      this.stopDetailsDialogLoading()
      this.showDetailsDialogSuccess("Transaction executed.")
      this.amountToRelease = 0
    },
    onRevokeError(error) {
      console.error("onReleaseReceipt: ", error)
      this.stopDetailsDialogLoading()
      this.showDetailsDialogError("Cannot execute transaction, see logs for more.")
      this.amountToRelease = 0
    },
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    },
    startDetailsDialogLoading() {
      this.detailsDialogLoading = true
    },
    stopDetailsDialogLoading() {
      this.detailsDialogLoading = false
    },
    showSuccess(message) {
      this.alerts.success.message = message
      this.alerts.success.show = true
    },
    showError(message) {
      this.alerts.error.message = message
      this.alerts.error.show = true
    },
    showDetailsDialogSuccess(message) {
      this.alerts.detailsDialog.success.message = message
      this.alerts.detailsDialog.success.show = true
    },
    showDetailsDialogError(message) {
      this.alerts.detailsDialog.error.message = message
      this.alerts.detailsDialog.error.show = true
    },
    getColorForStatus(status) {
      if (status.toUpperCase() === "REVOKED") {
        return "red"
      }
      return "green"
    },
    openBeneficiaryInExplorer(beneficiary) {
      window.open(`${this.globalConfig.explorerRootURL}/address/${beneficiary}`, "_blank")
    },
    shortAddress(addr) {
      return truncateEthAddress(addr)
    },
    initialize() {},
  },
  async mounted() {
    if (this.tokenVesting === null) {
      this.fetchingDataCompleted = true
      this.stopLoading()
      this.showError("Invalid contract address")
    } else {
      if (this.connectedUserIsOwner) {
        await this.loadDataOwner()
      } else {
        await this.loadData()
      }
    }
  },
  computed: {
    displayFetchingDataDialog() {
      return !this.fetchingDataCompleted
    },
    connectedUserIsOwner() {
      return this.isOwner
    },
    ...mapState(["web3", "tokenVesting", "erc20", "isOwner", "globalConfig"]),
  },
}
/*function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}*/
</script>

<style scoped></style>
