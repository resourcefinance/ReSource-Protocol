import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import PortfolioHeader from "./components/PortfolioHeader"
import PortfolioPage from "./pages/PortfolioPage"

const PortfolioRoutes = () => {
  const { path } = useRouteMatch()
  console.log("PortfolioRoutes.tsx --  path", path)

  return (
    <>
      <PortfolioHeader />
      <Switch>
        <Route path={`${path}`} component={PortfolioPage} />
      </Switch>
    </>
  )
}

export default PortfolioRoutes
