import React from "react"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Routes from "./routes"
import ApolloProvider from "./services/apollo/ApolloProvider"
import Web3Provider from "./services/web3/Web3Provider"
import { ThemeProvider } from "./theme"
import "./theme/App.scss"

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Web3Provider>
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
