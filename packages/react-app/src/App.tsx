import React from "react"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Routes from "./routes"
import ApolloProvider from "./services/apollo/ApolloProvider"
import { ThemeProvider } from "./theme"

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <ApolloProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Header />
              <Routes />
              <Footer />
            </BrowserRouter>
          </ThemeProvider>
        </ApolloProvider>
      </RecoilRoot>
    </div>
  )
}

export default App
