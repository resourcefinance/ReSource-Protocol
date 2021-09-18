import { log, BigInt, Address } from "@graphprotocol/graph-ts"
import { CreditLine, Underwriter } from "../../../generated/schema"
import { CreditLineRewardClaimed } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleCreditLineRewardClaimed(event: CreditLineRewardClaimed): void {
  log.info("called CreditLineRewardClaimed handler", [])
  let underwritees = event.params.underwritees
  let underwriterAddress = event.params.underwriter
  for (var i = 0; i < underwritees.length; i++) {
    let id = underwritees[i].toHex() + "-" + underwriterAddress.toHex()
    let creditLine = CreditLine.load(id)
    if (creditLine == null) {
      return
    }
    creditLine.outstandingReward = new BigInt(0)
    creditLine.save()
  }
  let underwriter = Underwriter.load(underwriterAddress.toHex())
  underwriter.totalRewards = underwriter.totalRewards.minus(event.params.totalClaimed)
  underwriter.save()
}
