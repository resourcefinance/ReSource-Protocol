import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { useWeb3Context } from "web3-react"
import PortfolioHeader from "./components/PortfolioHeader"
import PortfolioPage from "./pages/PortfolioPage"

const PortfolioRoutes = () => {
  const { path } = useRouteMatch()
  const context = useWeb3Context()

  return (
    <>
      {context.library && <PortfolioHeader />}
      <Switch>
        <Route path={`${path}`} component={PortfolioPage} />
      </Switch>
    </>
  )
}

export default PortfolioRoutes
