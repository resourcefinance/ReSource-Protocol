import { Transfer } from "../../../generated/ReSourceToken/ReSourceToken"
import { BigInt } from "@graphprotocol/graph-ts"
import { Underwriter } from "../../../generated/schema"

export function handleSourceBalanceUpdate(event: Transfer): void {
  let recipient = Underwriter.load(event.params.to.toHex())
  let sender = Underwriter.load(event.params.from.toHex())
  if (!recipient) {
    recipient = new Underwriter(event.params.to.toHex())
    recipient.totalCollateral = new BigInt(0)
    recipient.totalRewards = new BigInt(0)
    recipient.balance = new BigInt(0)
  }
  if (!sender) {
    sender = new Underwriter(event.params.to.toHex())
    sender.totalCollateral = new BigInt(0)
    sender.totalRewards = new BigInt(0)
    sender.balance = new BigInt(0)
  }
  recipient.balance = recipient.balance.plus(event.params.value)
  sender.balance = sender.balance.minus(event.params.value)
  recipient.save()
  sender.save()
}
