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

export const NETWORK = (chainId: Number) => {
  for (const n in NETWORKS) {
    if ((NETWORKS as any)[n].chainId === chainId) {
      return (NETWORKS as any)[n]
    }
  }
}
