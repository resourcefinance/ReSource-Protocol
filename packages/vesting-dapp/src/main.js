import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueClipboard from "vue-clipboard2";

import router from "./router";
import store from "./store";
import { initWeb3 } from "./web3";
import { validateEthAddress } from "./services/utils";

Vue.use(VueClipboard);
Vue.config.productionTip = false;
window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
  const account = accounts[0];
  console.log(account);
  initWeb3(onWeb3Ready);
});

async function onWeb3Ready(web3) {
  store.state.web3 = web3;
  console.log(window.ethereum.chainId);
  if (
    validateEthAddress(store.state.globalConfig.tokenVestingContractAddress)
  ) {
    store.state.tokenVesting = new store.state.web3.eth.Contract(
      store.state.globalConfig.tokenVestingContractAbi,
      store.state.globalConfig.tokenVestingContractAddress,
      {
        from: window.ethereum.selectedAddress,
      }
    );
    const owner = await store.state.tokenVesting.methods.owner().call();
    console.log(`Token Vesting Contract owner: ${owner}`);
    store.state.isOwner =
      owner.toUpperCase() === window.ethereum.selectedAddress.toUpperCase();
    console.log(`Connected address is owner: ${store.state.isOwner}`);
    store.state.erc20.address = await store.state.tokenVesting.methods
      .getToken()
      .call();
  }
  if (validateEthAddress(store.state.erc20.address)) {
    console.log(`Token address: ${store.state.erc20.address}`);
    store.state.erc20.contract = new store.state.web3.eth.Contract(
      store.state.globalConfig.erc20ContractAbi,
      store.state.erc20.address,
      {
        from: window.ethereum.selectedAddress,
      }
    );
    store.state.erc20.name = await store.state.erc20.contract.methods
      .name()
      .call();
    store.state.erc20.symbol = await store.state.erc20.contract.methods
      .symbol()
      .call();
  }
  new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}
