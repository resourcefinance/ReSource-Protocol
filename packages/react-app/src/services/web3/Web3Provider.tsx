import Provider, { Connectors } from "web3-react"
import { NETWORKS } from "./constants"

const { InjectedConnector } = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [
    NETWORKS.celo.chainId,
    NETWORKS["celo-alfajores"].chainId,
    NETWORKS.localhost.chainId,
  ],
})

const connectors = { MetaMask }

const Web3Provider = (props) => {
  return (
    <Provider connectors={connectors} libraryName={"ethers.js"}>
      {props.children}
    </Provider>
  )
}

export default Web3Provider
