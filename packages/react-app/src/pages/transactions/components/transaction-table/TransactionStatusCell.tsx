import { HStack, Text } from "@chakra-ui/react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCheckCircle, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import { Transaction, TransactionStatus } from "../../../../generated/graphql"
import colors from "../../../../theme/foundations/colors"
import { baseCellStyles, Header, TransactionColumn } from "./foundations"

export const transactionStatusPropsMap: Record<
  TransactionStatus,
  { icon: IconDefinition; color: string; label?: string }
> = {
  QUEUED: { color: colors.gray[500], icon: faSpinner },
  PENDING: { color: colors.gray[500], icon: faSpinner },
  CONFIRMED: { color: colors.green.main, icon: faCheckCircle },
  FAILED: { color: colors.red.main, icon: faExclamationCircle },
}

type TransactionStatusCellProps = CellProps<TransactionRowData, TransactionStatus>

const TransactionStatusCell = ({ cell }: TransactionStatusCellProps) => {
  const transactionStatus = cell.value
  const { label, color, icon } = transactionStatusPropsMap[transactionStatus]

  return (
    <HStack {...baseCellStyles}>
      <Text variant="caption" color={color} textAlign="right">
        {label ?? transactionStatus.toLocaleLowerCase()}
      </Text>
      <FontAwesomeIcon color={color} icon={icon} />
    </HStack>
  )
}

export const getTransactionStatus = (t: Transaction): TransactionStatus => {
  return t.status as TransactionStatus
}

export const transactionStatusColumn: TransactionColumn = {
  Header: Header({ title: "transaction" }),
  accessor: "status",
  Cell: TransactionStatusCell,
}
