import { Route, Switch } from "react-router-dom"
import BusinessTransactionsPage from "./pages/business/pages/BusinessTransactionsPage"
import SearchBusinessesPage from "./pages/business/pages/SearchBusinessesPage"
import PortfolioPage from "./pages/portfolio/pages/PortfolioPage"

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/businesses" component={SearchBusinessesPage} />
      <Route exact path="/businesses/:handle" component={BusinessTransactionsPage} />
      <Route exact path="/portfolio" component={PortfolioPage} />
      <Route path="/" component={BusinessTransactionsPage} />
    </Switch>
  )
}

export default Routes
