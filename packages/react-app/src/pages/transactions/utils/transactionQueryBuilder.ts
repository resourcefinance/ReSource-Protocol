import { isEmpty } from "lodash"
import { OrderStatus, TransactionWhereInput } from "../../../generated/resource-network/graphql"
import { TransactionType } from "../../../store/transaction"

type FilterProps = {
  filteredTypes: TransactionType[]
  currId: string // current business id
}

export const generateFilters = ({ filteredTypes, currId }: FilterProps): TransactionWhereInput => {
  return {
    AND: [
      filterByCurrentBusinessWallet(currId),
      filterByTransactionType({ filteredTypes, currId }),
    ],
  }
}

export const filterByCurrentBusinessWallet = (walletId?: string): TransactionWhereInput => {
  return {
    OR: [
      { senderId: { equals: walletId || undefined } },
      { recipientId: { equals: walletId || undefined } },
    ],
  }
}

export const filterByOpenAndInProgressSales = (walletId: string): TransactionWhereInput => {
  return {
    AND: [
      filterByCurrentBusinessWallet(walletId),
      salesFilter({ filteredTypes: ["sales"], currId: walletId }),
      {
        order: {
          OR: [
            { status: { equals: OrderStatus.Open } },
            { status: { equals: OrderStatus.Inprogress } },
          ],
        },
      },
    ],
  }
}

export const filterByTransactionType = ({
  filteredTypes,
  currId,
}: FilterProps): TransactionWhereInput => {
  if (filteredTypes.includes("all")) return {}
  if (filteredTypes.length === 4) return {}

  const where = {
    OR: [
      sentFilter({ filteredTypes, currId }),
      salesFilter({ filteredTypes, currId }),
      receivedFilter({ filteredTypes, currId }),
      purchasesFilter({ filteredTypes, currId }),
    ].filter((q) => !isEmpty(q)),
  }
  return where
}

const sentFilter = ({ filteredTypes, currId }: FilterProps): TransactionWhereInput => {
  if (!filteredTypes.includes("sent")) return {}
  return {
    senderId: { equals: currId },
    orderId: { equals: null },
  }
}

const salesFilter = ({ filteredTypes, currId }: FilterProps): TransactionWhereInput => {
  if (!filteredTypes.includes("sales")) return {}
  return {
    recipientId: { equals: currId },
    orderId: { not: { equals: null } },
  }
}

const receivedFilter = ({ filteredTypes, currId }: FilterProps): TransactionWhereInput => {
  if (!filteredTypes.includes("received")) return {}
  return {
    recipientId: { equals: currId },
    orderId: { equals: null },
  }
}

const purchasesFilter = ({ filteredTypes, currId }: FilterProps): TransactionWhereInput => {
  if (!filteredTypes.includes("purchases")) return {}
  return {
    senderId: { equals: currId },
    orderId: { not: { equals: null } },
  }
}
