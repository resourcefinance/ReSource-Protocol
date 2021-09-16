import { CreditLine, Underwriter } from "../../../generated/schema"
import { CreditLineReward } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleCreditLineReward(event: CreditLineReward): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  creditLine.outstandingReward = creditLine.outstandingReward.plus(
    event.params.creditLine.data.reward,
  )
  creditLine.totalReward = creditLine.totalReward.plus(event.params.creditLine.data.reward)
  creditLine.save()
  let underwriter = Underwriter.load(creditLine.underwriter)
  underwriter.totalRewards = underwriter.totalRewards.plus(event.params.creditLine.data.reward)
  underwriter.save()
}
