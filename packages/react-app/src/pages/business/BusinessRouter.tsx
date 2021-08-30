import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import BusinessHeader from "./components/BusinessHeader"
import BusinessSummaryPage from "./pages/BusinessSummaryPage"
import BusinessTransactionsPage from "./pages/BusinessTransactionsPage"
import TransactionDetailsPage from "./pages/TransactionDetailsPage"

const BusinessRouter = () => {
  const { path } = useRouteMatch()
  console.log("BusinessRouter.tsx --  path", path)
  return (
    <>
      <BusinessHeader />
      <Switch>
        <Route path={`${path}/:handle/summary`} component={BusinessSummaryPage} />
        <Route path={`${path}:handle/transactions`} component={BusinessTransactionsPage} />
        <Route path={`${path}:handle/transactions/:id`} component={TransactionDetailsPage} />
      </Switch>
    </>
  )
}

export default BusinessRouter
