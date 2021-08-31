import { Avatar, HStack, Text } from "@chakra-ui/react"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import { Transaction } from "../../../../generated/graphql"
import { baseCellStyles, Header, TransactionColumn } from "./foundations"

export type BusinessCellData = { handle: string; logoUrl: string }

type BusinessCellProps = CellProps<TransactionRowData, BusinessCellData>

const BusinessCell = ({ cell }: BusinessCellProps) => {
  const businessData = cell.value
  const { handle, logoUrl } = businessData

  return (
    <HStack {...baseCellStyles}>
      <Text noOfLines={1} overflow="hidden">{`@${handle}`}</Text>
      <Avatar size="xs" src={logoUrl} alt={"Logo"} />
    </HStack>
  )
}

export const getBusiness = (t: Transaction, curBusinessId: string): BusinessCellData => {
  const otherWallet = t.recipient?.id === curBusinessId ? t.sender : t.recipient
  const { handle = "", logoUrl = "" } = otherWallet?.business ?? {}
  return { handle, logoUrl: logoUrl as string }
}

const sortBusiness = (rowA, rowB, id, desc) => {
  if (rowA.original.business.handle > rowB.original.business.handle) return -1
  if (rowA.original.business.handle < rowB.original.business.handle) return 1
  return 0
}

export const businessColumn: TransactionColumn = {
  Header: Header({ title: "business" }),
  accessor: "business",
  Cell: BusinessCell,
  // sortType: sortBusiness,
  disableSortBy: true,
}
