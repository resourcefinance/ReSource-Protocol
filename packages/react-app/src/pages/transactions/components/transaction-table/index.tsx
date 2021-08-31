import { Column } from "react-table"
import { Order, Transaction, TransactionStatus } from "../../../../generated/graphql"
import { amountColumn } from "./AmountCell"
import { BusinessCellData, businessColumn, getBusiness } from "./BusinessCell"
import { dateColumn } from "./DateCell"
import { getOrder, orderColumn } from "./OrderCell"
import { getTransactionStatus, transactionStatusColumn } from "./TransactionStatusCell"
import { getType, TypeCellData, typeColumn } from "./TypeCell"

export interface TransactionRowData {
  id: string
  createdAt: string
  amount: number
  type: TypeCellData
  status: TransactionStatus
  order: Order | null
  business: BusinessCellData
  transaction: Transaction
  currentWalletId: string
}

export const formatIntoTableData = (
  transactions: Transaction[],
  currentWalletId: string,
): TransactionRowData[] => {
  return transactions.map((t) => {
    return {
      id: t.id,
      order: getOrder(t),
      amount: t.amount || 0,
      createdAt: t.createdAt,
      type: getType(t, currentWalletId),
      business: getBusiness(t, currentWalletId),
      status: getTransactionStatus(t),
      transaction: t,
      currentWalletId,
    }
  })
}

export const fullSchemaDesktop: Column[] = [
  { ...typeColumn, width: 150 },
  { ...businessColumn, width: 150 },
  { ...dateColumn, width: 140 },
  { ...amountColumn, width: 95 },
  { ...transactionStatusColumn, width: 100 },
  { ...orderColumn, width: 100 },
]

export const fullSchemaMobile: Column[] = [
  { ...typeColumn, width: 200 },
  { ...amountColumn, width: 75 },
]

export const lightSchemaDesktop: Column[] = [
  { ...typeColumn, width: 150 },
  { ...businessColumn, width: 150 },
  { ...dateColumn, width: 155 },
  { ...amountColumn, width: 95 },
  { ...orderColumn, width: 115 },
]

export const lightSchemaMobile: Column[] = [{ ...typeColumn }, { ...amountColumn, width: 75 }]
