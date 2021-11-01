<template>
  <div>
    <h2 class="mb-6">New Vesting Schedule</h2>
    <v-card elevation="0" :loading="loading">
      <v-alert type="success" dismissible v-if="alerts.success.show">
        {{ alerts.success.message }}
      </v-alert>
      <v-alert type="error" dismissible v-if="alerts.error.show">
        {{ alerts.error.message }}
      </v-alert>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.beneficiary"
              :rules="ethereumAddressRules"
              label="Beneficiary"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.tokens"
              :rules="tokenAmountRules"
              :suffix="symbolSuffix"
              type="number"
              label="Tokens"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.cliff"
              outlined
              type="number"
              label="Cliff vesting"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="vestingIntervalItems"
              v-model="form.vestingInterval"
              label="Vesting Interval"
              prepend-inner-icon="mdi-camera-timer"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  v-model="form.startDate"
                  label="Start Date"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.startDate"
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <!-- Fix start time -->
            <v-menu
              ref="startTimeMenu"
              v-model="startTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="form.startTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.startTime"
                  outlined
                  label="Start Time"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="startTimeMenu"
                v-model="form.startTime"
                full-width
                @click:minute="$refs.startTimeMenu.save(form.startTime)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.endDate"
                  label="End Date"
                  prepend-inner-icon="mdi-calendar"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="form.endDate" @input="endDateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-menu
              ref="endTimeMenu"
              v-model="endTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="form.endTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.endTime"
                  label="End Time"
                  outlined
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="endTimeMenu"
                v-model="form.endTime"
                full-width
                @click:minute="$refs.endTimeMenu.save(form.endTime)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-switch v-model="form.revocable" label="Revocable"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn color="primary" @click="createVesting">Create Vesting</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"
const ethers = require("ethers")
export default {
  name: "CreateVesting",
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
      beneficiary: "",
      tokens: 0,
      startDate: new Date().toISOString().substr(0, 10),
      startTime: null,
      endDate: new Date().toISOString().substr(0, 10),
      endTime: null,
      revocable: true,
      vestingInterval: "Month",
      cliff: 0,
    },
    startDateMenu: false,
    startTimeMenu: false,
    endDateMenu: false,
    endTimeMenu: false,
    vestingIntervalItems: ["Second", "Day", "Week", "Month"],
    ethereumAddressRules: [
      (v) => !!v || "Ethereum address is required",
      (v) => /^(0x)?[0-9a-fA-F]{40}$/.test(v) || "Ethereum address must be valid",
    ],
    tokenAmountRules: [(v) => v > 0 || "Token amount must be greater than 0"],
  }),
  methods: {
    createVesting() {
      const startTimeFull = new Date(Date.parse(`${this.form.startDate} ${this.form.startTime}`))
      const endTimeFull = new Date(Date.parse(`${this.form.endDate} ${this.form.endTime}`))
      const startTime = startTimeFull.getTime() / 1000
      const endTime = endTimeFull.getTime() / 1000
      const cliff = this.form.cliff * 24 * 60 * 60
      let slicePeriodSeconds
      switch (this.form.vestingInterval) {
        case "Second":
          slicePeriodSeconds = 1
          break
        case "Day":
          slicePeriodSeconds = 60 * 60 * 24
          break
        case "Week":
          slicePeriodSeconds = 60 * 60 * 24 * 7
          break
        case "Month":
          slicePeriodSeconds = 60 * 60 * 24 * 30
          break
      }
      const duration = endTime - startTime
      const amount = ethers.utils.parseUnits(this.form.tokens, "ether").toString()
      this.startLoading()
      this.tokenVesting.methods
        .createVestingSchedule(
          this.form.beneficiary,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          this.form.revocable,
          amount,
        )
        .send({ from: window.ethereum.selectedAddress })
        .on("receipt", this.onCreateVestingScheduleReceipt)
        .on("error", this.onCreateVestingScheduleError)
    },
    onCreateVestingScheduleReceipt(receipt) {
      console.log("onCreateVestingScheduleReceipt: ", receipt)
      this.stopLoading()
      this.showSuccess("Vesting successfully created.")
    },
    onCreateVestingScheduleError(error) {
      console.error("onCreateVestingScheduleError: ", error)
      this.stopLoading()
      this.showError("Cannot create vesting, see logs for more.")
    },
    initForm() {
      this.form.beneficiary = ""
      const nowTimeHourMinutes = new Date().toLocaleTimeString().substr(0, 4)
      this.form.tokens = "1000"
      this.form.startTime = nowTimeHourMinutes
      this.form.endTime = nowTimeHourMinutes
    },
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    },
    showSuccess(message) {
      this.alerts.success.message = message
      this.alerts.success.show = true
    },
    showError(message) {
      this.alerts.error.message = message
      this.alerts.error.show = true
    },
  },
  async mounted() {
    if (this.tokenVesting === null) {
      this.stopLoading()
      this.showError("Invalid contract address")
    } else {
      this.initForm()
    }
  },
  computed: {
    symbolSuffix() {
      return `$${this.erc20.symbol}`
    },
    ...mapState(["web3", "tokenVesting", "erc20"]),
  },
}
</script>

<style scoped></style>
