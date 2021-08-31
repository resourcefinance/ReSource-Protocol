import { HStack, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import { Transaction } from "../../../../generated/graphql"
import { TransactionType } from "../../../../store/transaction"
import { baseCellStyles, Header, TransactionColumn, transactionTypeIconMap } from "./foundations"

export type TypeCellData = { type: TransactionType; name?: string; quantity?: number }
type TypeCellProps = CellProps<TransactionRowData, TypeCellData>

const TypeCell = ({ cell }: TypeCellProps) => {
  const { type, name, quantity } = cell.value
  const label = type === "sent" ? "Sent" : type === "received" ? "Received" : name

  return (
    <HStack {...baseCellStyles} justifyContent="flex-start" as="span" overflow="hidden">
      <FontAwesomeIcon color="gray" icon={transactionTypeIconMap[type]} />
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        {label}
      </Text>
      {quantity && <Text variant="number">({quantity})</Text>}
    </HStack>
  )
}

const sortType = (rowA, rowB, id, desc) => {
  const typeA = rowA.original.type
  const typeB = rowB.original.type
  if (typeA.type > typeB.type) return -1
  if (typeA.type < typeB.type) return 1
  if (typeA.name > typeB.name) return -1
  if (typeA.name < typeB.name) return 1
  return 0
}

export const getType = (t: Transaction, curWalletId: string): TypeCellData => {
  if (!t?.id) return { type: "sent" }

  const { recipient, sender, order } = t
  const listing = order?.listing

  const getOrderName = (type: string) => listing?.title ?? type

  let returnVal: TypeCellData

  if (!order && sender?.id === curWalletId) {
    returnVal = { type: "sent" }
  } else if (!order && recipient?.id === curWalletId) {
    returnVal = { type: "received" }
  } else if (order && sender?.id === curWalletId) {
    returnVal = { type: "purchase", name: getOrderName("Purchase"), quantity: order?.quantity ?? 0 }
  } else if (order && recipient?.id === curWalletId) {
    returnVal = { type: "sale", name: getOrderName("Sale"), quantity: order.quantity }
  } else {
    console.warn("could not parse transaction type")
    returnVal = { type: "sent" } // this seems problematic... might want to allow for null or undefined transaction type?
  }
  return returnVal
}

export const typeColumn: TransactionColumn = {
  Header: Header({ title: "type", textAlign: "left" }),
  accessor: "type",
  Cell: TypeCell,
  // sortType: sortType,
  disableSortBy: true,
}
