import React from "react"
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"
import Header from "./components/Header"
import Routes from "./routes"
import { ThemeProvider } from "./theme"

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <ThemeProvider>
          <BrowserRouter>
            <Header />
            <Routes />
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  )
}

export default App
