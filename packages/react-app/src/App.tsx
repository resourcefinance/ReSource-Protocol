import React from "react"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Routes from "./routes"
import ApolloProvider from "./services/apollo/ApolloProvider"
import { ThemeProvider } from "./theme"
import Web3Provider, { Connectors } from "web3-react"
import { NETWORKS } from "./constants"
import "./theme/App.scss"

const { InjectedConnector } = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [
    NETWORKS.celo.chainId,
    NETWORKS["celo-alfajores"].chainId,
    NETWORKS.localhost.chainId,
  ],
})

const connectors = { MetaMask }

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Web3Provider connectors={connectors} libraryName={"ethers.js"}>
          <ApolloProvider>
            <ThemeProvider>
              <BrowserRouter>
                <Header />
                <Routes />
                <Footer />
              </BrowserRouter>
            </ThemeProvider>
          </ApolloProvider>
        </Web3Provider>
      </RecoilRoot>
    </div>
  )
}

export default App
