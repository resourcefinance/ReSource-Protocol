import { BalanceUpdate } from "../../../generated/RUSD/RUSD"
import { CreditLine, Underwritee } from "../../../generated/schema"

export function handleBalanceUpdate(event: BalanceUpdate): void {
  let recipient = Underwritee.load(event.params.recipient.toHex())
  let sender = Underwritee.load(event.params.sender.toHex())
  if (recipient) {
    let creditLine = CreditLine.load(recipient.creditLine)
    let creditBalance = event.params.recipientCreditBalance
    let positiveBalance = event.params.recipientBalance
    creditLine.balance = positiveBalance.minus(creditBalance)
    creditLine.save()
  }
  if (sender) {
    let creditLine = CreditLine.load(sender.creditLine)
    let creditBalance = event.params.senderCreditBalance
    let positiveBalance = event.params.senderBalance
    creditLine.balance = positiveBalance.minus(creditBalance)
    creditLine.save()
  }
}
