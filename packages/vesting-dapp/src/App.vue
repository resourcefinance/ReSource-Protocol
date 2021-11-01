<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app permanent clipped>
      <v-list nav dense class="pt-5">
        <v-list-item link @click="navVestingList">
          <v-list-item-icon>
            <v-icon>mdi-eye-settings</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Vesting Schedule List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="navCreateVesting" v-if="isConnectedWalletOwner">
          <v-list-item-icon>
            <v-icon>mdi-briefcase-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>New Vesting Schedule</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="navAdmin" v-if="isConnectedWalletOwner">
          <v-list-item-icon>
            <v-icon>mdi-account-lock</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Admin Panel</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left flat>
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>
        <div class="d-flex align-baseline">
          <v-img :src="require('./assets/logo.svg')" />
          <h5 class="ml-1 font-weight-regular">vesting</h5>
        </div>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="mx-10 mt-5">
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app inset>
      <app-footer></app-footer>
    </v-footer>
  </v-app>
</template>

<script>
import AppFooter from "./components/Footer"
import { mapState } from "vuex"
export default {
  name: "App",

  components: {
    AppFooter,
  },

  data: () => ({
    drawer: null,
    isConnectedWalletOwner: null,
  }),

  mounted() {
    this.isConnectedWalletOwner = this.isOwner
  },

  methods: {
    navCreateVesting() {
      this.$router.push("/owner/vesting/new")
    },
    navVestingList() {
      this.$router.push("/vesting")
    },
    navAdmin() {
      this.$router.push("/owner/admin")
    },
  },
  computed: {
    ...mapState(["isOwner"]),
  },
}
</script>
