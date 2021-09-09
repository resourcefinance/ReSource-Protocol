import { readFileSync } from "fs"
import * as config from "./contracts/artifacts.json"

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

export const SUBGRAPH_URLS = {
  localhost: "http://localhost:8000/subgraphs/name/mu-dapp",
  testnet: "",
  mainet: "",
}

export const CONTRACTS = {
  UnderwriteManager: config.UnderwriteManager_Proxy,
  MutualityToken: config.MutualityToken_Proxy,
  RUSDToken: config.RUSD_Proxy,
}

export const NETWORK = (chainId: Number) => {
  for (const n in NETWORKS) {
    if ((NETWORKS as any)[n].chainId === chainId) {
      return (NETWORKS as any)[n]
    }
  }
}
