import { BoxProps } from "@chakra-ui/layout"
import React from "react"
import TransactionsPage from "../../transactions/TransactionsPage"

const BusinessTransactionsPage = ({ ...rest }: BoxProps) => {
  return <TransactionsPage />
}

export default BusinessTransactionsPage
