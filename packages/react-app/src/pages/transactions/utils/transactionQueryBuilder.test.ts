import { filterByTransactionType } from "./transactionQueryBuilder"
import { TransactionType } from "../../../store/transaction"

const currId = "business-1" // current business id

describe("transactionQueryBuilder", () => {
  it('should handle transaction type "all"', () => {
    const filteredTypes = ["all"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where).toEqual({})
  })

  it('should handle single transaction type "purchases"', () => {
    const filteredTypes = ["purchases"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(1)
    const purchasesWhere = where.OR?.[0]
    expect(purchasesWhere).toEqual({
      senderId: { equals: currId },
      orderId: { not: { equals: null } },
    })
  })

  it('should handle single transaction type "sales"', () => {
    const filteredTypes = ["sales"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(1)
    const salesWhere = where.OR?.[0]
    expect(salesWhere).toEqual({
      recipientId: { equals: currId },
      orderId: { not: { equals: null } },
    })
  })

  it('should handle single transaction type "sent"', () => {
    const filteredTypes = ["sent"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(1)
    const sentWhere = where.OR?.[0]
    expect(sentWhere).toEqual({
      senderId: { equals: currId },
      orderId: { equals: null },
    })
  })

  it('should handle single transaction type "receieved"', () => {
    const filteredTypes = ["received"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(1)
    const receivedWhere = where.OR?.[0]
    expect(receivedWhere).toEqual({
      recipientId: { equals: currId },
      orderId: { equals: null },
    })
  })

  it('should handle dual transaction type "purchases" and "sales"', () => {
    const filteredTypes = ["purchases", "sales"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(2)
  })

  it('should handle dual transaction type "purchases" and "sent"', () => {
    const filteredTypes = ["purchases", "sent"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(2)
  })

  it('should handle three transaction type "purchases", "received", and "sent"', () => {
    const filteredTypes = ["purchases", "received", "sent"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where.OR).toHaveLength(3)
  })

  it("should handle all transaction types selected", () => {
    const filteredTypes = ["sales", "purchases", "sent", "received"] as TransactionType[]
    const where = filterByTransactionType({ filteredTypes, currId })
    expect(where).toEqual({})
  })
})
