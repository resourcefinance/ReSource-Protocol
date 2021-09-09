import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import BusinessRoutes from "./pages/business/BusinessRoutes"
import SearchBusinessesPage from "./pages/business/pages/SearchBusinessesPage"
import PortfolioRoutes from "./pages/portfolio/PortfolioRoutes"

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={SearchBusinessesPage} />
        <Route path="/businesses/:handle" component={BusinessRoutes} />
        <Route exact path="/portfolio" component={PortfolioRoutes} />
        <Redirect to={{ pathname: "/" }} />
      </Switch>
    </>
  )
}

export default Routes
