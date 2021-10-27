<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item link @click="navVestingList">
          <v-list-item-icon>
            <v-icon>mdi-eye-settings</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Vesting Schedule List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          @click="navCreateVesting"
          v-if="isConnectedWalletOwner"
        >
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

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Token Vesting</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <app-footer></app-footer>
    </v-footer>
  </v-app>
</template>

<script>
import AppFooter from "./components/Footer";
import { mapState } from "vuex";
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
    this.isConnectedWalletOwner = this.isOwner;
  },

  methods: {
    navCreateVesting() {
      this.$router.push("/owner/vesting/new");
    },
    navVestingList() {
      this.$router.push("/vesting");
    },
    navAdmin() {
      this.$router.push("/owner/admin");
    },
  },
  computed: {
    ...mapState(["isOwner"]),
  },
};
</script>
