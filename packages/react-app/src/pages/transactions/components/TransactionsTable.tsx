/* eslint-disable @typescript-eslint/no-empty-function */
import { BoxProps } from "@chakra-ui/layout"
import { Box, SkeletonText, useBreakpointValue } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { useSetRecoilState } from "recoil"
import Table, { OnOrderByProps } from "../../../components/Table"
import { Transaction } from "../../../generated/graphql"
import { transactionOrderBySelector } from "../../../store/transaction"
import { useQueryBusinessViaHandleInUrl } from "../../business/utils/hooks"
import {
  formatIntoTableData,
  fullSchemaDesktop,
  fullSchemaMobile,
  lightSchemaDesktop,
  lightSchemaMobile,
} from "./transaction-table/index"

interface Props extends BoxProps {
  variant: "full-table" | "light-table"
  transactions: Transaction[]
  onRowClick?: (id: string) => void
  isLoading?: boolean
}

const TransactionsTable = ({ variant, transactions, onRowClick, isLoading, ...rest }: Props) => {
  const businessQuery = useQueryBusinessViaHandleInUrl()
  const wallet = businessQuery.data?.findOneBusinessByHandle?.wallet

  const setRecoilOrderBy = useSetRecoilState(transactionOrderBySelector)
  const device = useBreakpointValue({ base: "mobile", md: "desktop" })
  const data = useMemo(() => formatIntoTableData(transactions, wallet?.id || ""), [
    transactions,
    wallet?.id,
  ])

  const columns = useMemo(() => {
    if (variant === "light-table") {
      if (device === "mobile") return lightSchemaMobile
      if (device === "desktop") return lightSchemaDesktop
    } else {
      if (device === "mobile") return fullSchemaMobile
    }
    return fullSchemaDesktop
  }, [device, variant])

  const handleOrderBy = ({ id: field, isSorted, isSortedDesc }: OnOrderByProps) => {
    const direction = isSorted ? (isSortedDesc ? "desc" : "asc") : undefined
    setRecoilOrderBy({ [field]: direction })
  }

  return (
    <Box {...rest}>
      {isLoading ? (
        <SkeletonText m={4} noOfLines={8} spacing="6" />
      ) : (
        <Table
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          onOrderBy={handleOrderBy}
          showHeader={variant !== "light-table"}
        />
      )}
    </Box>
  )
}

export default TransactionsTable
