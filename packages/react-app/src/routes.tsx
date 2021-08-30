import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import BusinessRouter from "./pages/business/BusinessRouter"
import SearchBusinessesPage from "./pages/business/pages/SearchBusinessesPage"
import PortfolioPage from "./pages/portfolio/pages/PortfolioPage"
import TestTransactionPage from "./pages/testing/transactions"

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={SearchBusinessesPage} />
      <Route path="/businesses" component={BusinessRouter} />
      <Route exact path="/tx-test" component={TestTransactionPage} />
      <Route exact path="/portfolio" component={PortfolioPage} />
      <Redirect to={{ pathname: "/" }} />
    </Switch>
  )
}

export default Routes
