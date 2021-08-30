import { keyBy } from "lodash"
import { atom, DefaultValue, selector, selectorFamily } from "recoil"
import { Transaction, TransactionOrderByInput } from "../generated/graphql"

export type TransactionType =
  | "all"
  | "purchase"
  | "purchases"
  | "sale"
  | "sales"
  | "sent"
  | "received"
export const transactionFilterTypes: TransactionType[] = [
  "all",
  "purchases",
  "sales",
  "sent",
  "received",
]
export const orderFilterTypes: TransactionType[] = ["all", "purchases", "sales"]
export const transactionFilterGroup = {
  orders: orderFilterTypes,
  transactions: transactionFilterTypes,
}

interface TransactionQueryOptions {
  page: number
  pageSize: number
  filteredTypes: TransactionType[]
  orderBy: TransactionOrderByInput
}

type TransactionId = string

export const transactionAtom = atom({
  key: "transactionAtom",
  default: {
    total: 0,
    loading: false,
    transactions: {} as Record<TransactionId, Transaction>,
    queryOptions: {
      page: 1,
      pageSize: 12,
      filteredTypes: ["all"],
      orderBy: { createdAt: "desc" },
    } as TransactionQueryOptions,
  },
})

export const transactionPaginationSelector = selector<{
  page: number
  pageSize: number
  total: number
}>({
  key: "transactionPaginationSelector",
  get: ({ get }) => {
    const total = get(transactionAtom).total
    const { page, pageSize } = get(transactionQuerySelector)
    return { page, pageSize, total }
  },
  set: ({ set }, { page, pageSize, total }: any) => {
    set(transactionAtom, (prevState: any) => ({ ...prevState, total }))
    set(transactionQuerySelector, (prevState: any) => ({ ...prevState, page }))
  },
})

export const transactionsArraySelector = selector<Transaction[]>({
  key: "transactionsArraySelector",
  get: ({ get }) => Object.values(get(transactionAtom).transactions),
  set: ({ set }, newArray: Transaction[] | DefaultValue) => {
    if (!newArray || newArray instanceof DefaultValue) {
      set(transactionAtom, (prev) => ({ ...prev, transactions: {} }))
    } else {
      const transactionsMap = keyBy(newArray, "id")
      set(transactionAtom, (prevState) => ({ ...prevState, transactions: transactionsMap }))
    }
  },
})

export const recentTransactionsSelector = selector<Transaction[]>({
  key: "recentTransactionsSelector",
  get: ({ get }) =>
    [...get(transactionsArraySelector)].sort((a, b) => b?.createdAt - a?.createdAt).slice(0, 5),
  set: ({ set }, newArray) => set(transactionsArraySelector, newArray),
})

export const transactionFilterSelector = selector<TransactionType[]>({
  key: "transactionFilterSelector",
  get: ({ get }) => get(transactionQuerySelector).filteredTypes,
  set: ({ set }, newValue) => {
    set(transactionQuerySelector, (prevState: any) => ({ ...prevState, filteredTypes: newValue }))
  },
})

export const transactionOrderBySelector = selector<TransactionOrderByInput>({
  key: "transactionOrderBySelector",
  get: ({ get }) => get(transactionQuerySelector).orderBy,
  set: ({ set }, newValue) => {
    set(transactionQuerySelector, (prevState: any) => ({ ...prevState, orderBy: newValue }))
  },
})

export const transactionQuerySelector = selector<TransactionQueryOptions>({
  key: "transactionQuerySelector",
  get: ({ get }) => get(transactionAtom).queryOptions,
  set: ({ set }, newValue) => {
    set(transactionAtom, (prevState: any) => ({ ...prevState, queryOptions: newValue }))
  },
})

export const transactionByIdSelector = selectorFamily<Transaction, string>({
  key: "transactionByIdSelector",
  get: (id) => ({ get }) => get(transactionAtom).transactions[id],
  set: (id) => ({ set, get }, newValue: Transaction | DefaultValue) => {
    const transactionsMap = get(transactionAtom).transactions
    const updatedTransactionsMap = { ...transactionsMap, [id]: newValue as Transaction }
    if (!newValue || newValue instanceof DefaultValue) delete updatedTransactionsMap.id
    set(transactionAtom, (prevState) => ({ ...prevState, transactions: updatedTransactionsMap }))
  },
})

export const transactionByOrderIdSelector = selectorFamily<Transaction | undefined, string>({
  key: "transactionByOrderIdSelector",
  get: (orderId) => ({ get }) =>
    get(transactionsArraySelector).find((t) => t?.order?.id === orderId) || undefined,
  set: (orderId) => ({ set, get }, newValue: Transaction | undefined | DefaultValue) => {
    const transaction = get(transactionByOrderIdSelector(orderId))
    if (!transaction) return
    const id = transaction.id
    set(transactionByIdSelector(transaction.id), newValue as any)
  },
})
