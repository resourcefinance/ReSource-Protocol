import { BigInt } from "@graphprotocol/graph-ts"
import { CreditLine, Underwritee, Underwriter } from "../../../generated/schema"
import { NewCreditLine } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleNewCreditLine(event: NewCreditLine): void {
  let underwriter = Underwriter.load(event.params.creditLine.underwriter.toHex())
  if (!underwriter) {
    underwriter = new Underwriter(event.params.creditLine.underwriter.toHex())
    underwriter.totalCollateral = new BigInt(0)
    underwriter.totalRewards = new BigInt(0)
    underwriter.balance = new BigInt(0)
  }
  let underwritee = Underwritee.load(event.params.creditLine.underwritee.toHex())
  if (!underwritee) {
    underwritee = new Underwritee(event.params.creditLine.underwritee.toHex())
  }
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = new CreditLine(id)
  creditLine.underwritee = event.params.creditLine.underwritee
  creditLine.collateral = event.params.creditLine.data.collateral
  underwriter.totalCollateral = underwriter.totalCollateral.plus(
    event.params.creditLine.data.collateral,
  )
  underwritee.creditLine = creditLine.id
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.totalReward = new BigInt(0)
  creditLine.underwriter = event.params.creditLine.underwriter.toHex()
  creditLine.active = true
  creditLine.creditLimit = event.params.creditLine.creditLimit
  creditLine.balance = new BigInt(0)
  creditLine.save()
  underwriter.save()
  underwritee.save()
}
