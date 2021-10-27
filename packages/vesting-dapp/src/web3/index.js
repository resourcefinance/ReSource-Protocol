import Web3 from "web3";

function initWeb3(callback) {
  console.log("initializing web3 environment");
  const ethEnabled = async () => {
    if (window.ethereum) {
      await callback(new Web3(window.ethereum));
      window.ethereum.enable();
      return true;
    }
    return false;
  };
  if (!ethEnabled()) {
    alert(
      "Please install an Ethereum compatible browser or extension like MetaMask to use this dApp!"
    );
  } else {
    console.log("web3 environment successfully loaded");
  }
}

export { initWeb3 };
