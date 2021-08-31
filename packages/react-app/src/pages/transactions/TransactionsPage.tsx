import { Box, Container, HStack } from "@chakra-ui/react"
import React, { useCallback, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import Pagination from "../../components/Pagination"
import { Transaction, useFindManyTransactionsLazyQuery } from "../../generated/graphql"
import {
  transactionAtom,
  transactionPaginationSelector,
  transactionQuerySelector,
  transactionsArraySelector,
} from "../../store/transaction"
import { useQueryBusinessViaHandleInUrl } from "../business/utils/hooks"
import TransactionsFilter from "./components/TransactionsFilter"
import TransactionsTable from "./components/TransactionsTable"
import { generateFilters } from "./utils/transactionQueryBuilder"

const TransactionsPage = () => {
  const history = useHistory()
  const location = useLocation()
  const { transactions, loading } = useTransactionsPageData()
  const [{ total, page, pageSize }, setPagination] = useRecoilState(transactionPaginationSelector)
  const goToTx = useCallback((id) => history.push(`${location.pathname}/${id}`), [history])

  return (
    <Box p={8} py="150px">
      <HStack spacing={8} mb={4}>
        <TransactionsFilter isLoading={loading} />
      </HStack>
      <TransactionsTable
        variant="full-table"
        transactions={transactions}
        onRowClick={goToTx}
      ></TransactionsTable>
      <Container marginTop="2em">
        <Pagination
          total={total}
          current={page}
          pageSize={pageSize}
          handleChange={(page: number) => {
            setPagination((prevState) => ({ ...prevState, page }))
          }}
        />
      </Container>
    </Box>
  )
}

export const useTransactionsPageData = () => {
  const businessQuery = useQueryBusinessViaHandleInUrl()
  const business = businessQuery.data?.findOneBusinessByHandle
  const { page, pageSize, filteredTypes, orderBy } = useRecoilValue(transactionQuerySelector)
  const [transactions, setTransactionArrayState] = useRecoilState(transactionsArraySelector)
  const [findManyTransactions, { data, loading }] = useFindManyTransactionsLazyQuery()
  const setTransactionState = useSetRecoilState(transactionAtom)

  // useEffect to fetch new set of data whenever query params change
  useEffect(() => {
    if (!business?.id) return
    const where = generateFilters({ filteredTypes, currId: business?.wallet?.id || "" })
    findManyTransactions({
      variables: { where, page, limit: pageSize, orderBy },
      context: { clientName: "subgraph" },
    })
  }, [findManyTransactions, page, pageSize, filteredTypes, business?.wallet?.id, orderBy])

  // useEffect to update transactions state whenever gql fetch completes
  useEffect(() => {
    if (!data?.findManyTransactions) return
    const total = data.findManyTransactions.total
    const transactions = data.findManyTransactions.transactions
    setTransactionArrayState(transactions as Transaction[])
    setTransactionState((prevState) => ({ ...prevState, total } as any))
  }, [data, setTransactionState])

  return { transactions, loading }
}

export default TransactionsPage
