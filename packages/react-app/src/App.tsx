import { useDisclosure } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { useWeb3Context } from "web3-react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ConnectWalletModal from "./components/wallet/ConnectWalletModal"
import Routes from "./routes"
import ApolloProvider from "./services/apollo/ApolloProvider"
import ErrorBoundary from "./services/errors/ErrorBoundary"
import Web3Provider from "./services/web3/Web3Provider"
import { ThemeProvider } from "./theme"
import "./theme/App.scss"

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <ErrorBoundary>
          <RecoilRoot>
            <Web3Provider>
              <ApolloProvider>
                <BrowserRouter>
                  <AppLayout />
                </BrowserRouter>
              </ApolloProvider>
            </Web3Provider>
          </RecoilRoot>
        </ErrorBoundary>
      </ThemeProvider>
    </div>
  )
}

const AppLayout = () => {
  const context = useWeb3Context()
  const walletModal = useDisclosure()

  useEffect(() => {
    if (!context.active) {
      walletModal.onOpen()
    }
  }, [context])

  return (
    <>
      <Header />
      {context.active && <Routes />}
      <Footer />
      <ConnectWalletModal isOpen={walletModal.isOpen} onClose={walletModal.onClose} />
    </>
  )
}

export default App
