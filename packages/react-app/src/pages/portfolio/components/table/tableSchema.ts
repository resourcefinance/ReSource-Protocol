import { ActionsCell, ActionsHeader } from "./ActionsCell"
import { TableCell } from "./TableCell"

export const tableSchema = [
  {
    Header: "balance",
    accessor: "balance",
    Cell: TableCell,
  },
  {
    Header: "credit underwritten",
    accessor: "creditLimit",
    isNumeric: true,
    Cell: TableCell,
  },
  {
    Header: "staked SOURCE",
    accessor: "collateral",
    Cell: TableCell,
  },
  {
    Header: "total rewards",
    accessor: "totalReward",
    isNumeric: true,
    Cell: TableCell,
  },
  {
    Header: "unclaimed rewards",
    accessor: "outstandingReward",
    isNumeric: true,
    Cell: TableCell,
  },
  {
    Header: ActionsHeader,
    accessor: "actions",
    isNumeric: true,
    Cell: ActionsCell,
  },
]
