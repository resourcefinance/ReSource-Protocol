import React, { useEffect } from "react"
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom"
import { useResetRecoilState } from "recoil"
import { transactionAtom } from "../../store/transaction"
import TransactionDetailsPage from "../transactions/TransactionDetailsPage"
import TransactionsPage from "../transactions/TransactionsPage"
import BusinessHeader from "./components/BusinessHeader"
import BusinessSummaryPage from "./pages/BusinessSummaryPage"

const BusinessRoutes = () => {
  const { path } = useRouteMatch()
  const resetBusinessState = useResetBusinessState()
  const { handle } = useParams<{ handle: string }>()

  useEffect(() => {
    resetBusinessState()
  }, [handle, resetBusinessState])

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

const useResetBusinessState = () => {
  const resetTransactions = useResetRecoilState(transactionAtom)

  return () => {
    resetTransactions()
  }
}

export default BusinessRoutes
