import Provider, { Connectors } from "web3-react"
import config from "../../config"

const { InjectedConnector } = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [config.NETWORK_CHAIN_ID],
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
