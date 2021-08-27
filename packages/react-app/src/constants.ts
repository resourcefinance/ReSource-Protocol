export const NETWORKS = {
  localhost: {
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + window.location.hostname + ":8545",
  },
  "celo-alfajores": {
    chainId: 44787,
    rpcUrl: `https://alfajores-forno.celo-testnet.org`,
    blockExplorer: "https://alfajores-blockscout.celo-testnet.org",
  },
  celo: {
    chainId: 42220,
    rpcUrl: `https://forno.celo.org`,
    blockExplorer: "https://explorer.celo.org",
  },
}

export const CONTRACTS = {
  UnderwriteManager: "0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f",
  MutualityToken: "0xfcDB4564c18A9134002b9771816092C9693622e3",
}

export const NETWORK = (chainId: Number) => {
  for (const n in NETWORKS) {
    if ((NETWORKS as any)[n].chainId === chainId) {
      return (NETWORKS as any)[n]
    }
  }
}
