import React from "react"
import { Route, Switch } from "react-router-dom"
import BusinessHeader from "./components/BusinessHeader"
import BusinessSummaryPage from "./pages/BusinessSummaryPage"
import BusinessTransactionsPage from "./pages/BusinessTransactionsPage"
import TransactionDetailsPage from "./pages/TransactionDetailsPage"

const BusinessRouter = () => {
  return (
    <>
      <BusinessHeader />
      <Switch>
        <Route exact path="/businesses/:handle/summary" component={BusinessSummaryPage} />
        <Route exact path="/businesses/:handle/transactions" component={BusinessTransactionsPage} />
        <Route path="/businesses/:handle/transactions/:id" component={TransactionDetailsPage} />
      </Switch>
    </>
  )
}

export default BusinessRouter
