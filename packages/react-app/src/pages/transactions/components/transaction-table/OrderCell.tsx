import { Box, Text } from "@chakra-ui/layout"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faArrowAltCircleRight,
  faCheckCircle,
  faClock,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import { Order, OrderStatus, Transaction } from "../../../../generated/graphql"
import colors from "../../../../theme/foundations/colors"
import { OrderStatusMenu } from "../OrderStatusMenu"
import { Header, TransactionColumn } from "./foundations"

export const orderStatusPropsMap: Record<
  OrderStatus,
  { icon: IconDefinition; color: string; label?: string }
> = {
  OPEN: { color: colors.orange.dark, icon: faClock },
  INPROGRESS: { color: colors.blue.main, icon: faArrowAltCircleRight, label: "in progress" },
  CLOSED: { color: colors.green.main, icon: faCheckCircle },
  CANCELLED: { color: colors.gray[700], icon: faTimesCircle },
}

type OrderCellProps = CellProps<TransactionRowData, Order>

export const OrderCell = ({ row, cell }: OrderCellProps) => {
  const order = cell.value

  if (!order) {
    return <Text color="gray.700">-----</Text>
  }

  return <OrderStatusMenu order={order} />
}

export const getOrder = (t: Transaction) => {
  return t.order ?? null
}

export const orderColumn: TransactionColumn = {
  Header: Header({ title: "order" }),
  accessor: "order",
  Cell: OrderCell,
  disableSortBy: true,
}
