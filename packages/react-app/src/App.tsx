import { useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { HashRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { useWeb3Context } from "web3-react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ConnectWalletModal from "./components/wallet/ConnectWalletModal"
import Routes from "./routes"
import ApolloProvider from "./services/apollo/ApolloProvider"
import ErrorBoundary from "./services/errors/ErrorBoundary"
import { useLoadReSourceTokenBalance } from "./services/web3/utils/useLoadReSourceTokenBalance"
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
                <HashRouter>
                  <AppLayout />
                </HashRouter>
              </ApolloProvider>
            </Web3Provider>
          </RecoilRoot>
        </ErrorBoundary>
      </ThemeProvider>
    </div>
  )
}

const AppLayout = () => {
  const canAccess = useAppGuard()
  const connectModal = useDisclosure()

  return (
    <>
      <Header />
      {canAccess && <Routes />}
      <Footer />
      <ConnectWalletModal isOpen={!canAccess} onClose={connectModal.onClose} />
    </>
  )
}

const useAppGuard = () => {
  const context = useWeb3Context()
  const [canAccess, setCanAccess] = useState(false)
  const sourceTokenBalance = useLoadReSourceTokenBalance()

  useEffect(() => {
    if (context.active && sourceTokenBalance?.gt(0)) {
      setCanAccess(true)
    } else {
      setCanAccess(false)
    }
  }, [context, sourceTokenBalance])

  return canAccess
}

export default App
