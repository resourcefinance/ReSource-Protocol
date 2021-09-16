import { CreditLine, Underwriter } from "../../../generated/schema"
import { ExtendCreditLine } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleExtendCreditLine(event: ExtendCreditLine): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  if (creditLine == null) {
    return
  }
  creditLine.collateral = event.params.creditLine.data.collateral
  creditLine.creditLimit = event.params.creditLine.creditLimit
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.save()
  let underwriter = Underwriter.load(event.params.creditLine.underwriter.toHex())
  underwriter.totalCollateral = underwriter.totalCollateral.plus(
    event.params.creditLine.data.collateral,
  )
  underwriter.save()
}
