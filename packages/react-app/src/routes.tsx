import {Route, Switch} from "react-router-dom"
import BusinessTransactionsPage from "./pages/business/pages/BusinessTransactionsPage"

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/business/:handle" component={BusinessTransactionsPage} />
      <Route exact path="/portfolio" />
      <Route path="/" component={BusinessTransactionsPage} />
    </Switch>
  )
}

export default Routes
