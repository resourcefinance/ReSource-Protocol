import React from "react"
import {BrowserRouter} from "react-router-dom"
import {RecoilRoot} from "recoil"
import Routes from "./routes"
import {ThemeProvider} from "./theme"

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <ThemeProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  )
}

export default App
