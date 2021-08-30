import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import TransactionDetailsPage from "../transactions/TransactionDetailsPage"
import TransactionsPage from "../transactions/TransactionsPage"
import BusinessHeader from "./components/BusinessHeader"
import BusinessSummaryPage from "./pages/BusinessSummaryPage"

const BusinessRoutes = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <BusinessHeader />
      <Switch>
        <Route path={`${path}/summary`} component={BusinessSummaryPage} />
        <Route exact path={`${path}/transactions`} component={TransactionsPage} />
        <Route path={`${path}/transactions/:transactionId`} component={TransactionDetailsPage} />
      </Switch>
    </>
  )
}

export default BusinessRoutes
