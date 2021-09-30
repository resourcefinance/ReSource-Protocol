import dotenv from "dotenv"
import { NETWORKS } from "./constants"
dotenv.config()

export const isProd = process.env.NODE_ENV === "production"

const getNetworkUrl = (name: string) => {
  const url = NETWORKS[name].rpcUrl
  if (!url) throw new Error("Invalid Network name in env")
  return url
}

const getNetworkID = (name: string) => {
  const url = NETWORKS[name].chainId
  if (!url) throw new Error("Invalid Network name in env")
  return url
}

const getExplorerUrl = (name: string) => {
  const url = NETWORKS[name].blockExplorer
  if (!url) throw new Error("Invalid Network name in env")
  return url
}

export const config = {
  NETWORK_URL: getNetworkUrl(process.env.REACT_APP_NETWORK_NAME!),
  NETWORK_EXPLORER_URL: getExplorerUrl(process.env.REACT_APP_NETWORK_NAME!),
  RESOURCE_NETWORK_URL: process.env.REACT_APP_RESOURCE_URL!,
  SUBGRAPH_URL: process.env.REACT_APP_SUBGRAPH_URL!,
  NETWORK_CHAIN_ID: getNetworkID(process.env.REACT_APP_NETWORK_NAME!),
}

export default config
