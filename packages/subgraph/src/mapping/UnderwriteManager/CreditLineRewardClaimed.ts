import { log } from "@graphprotocol/graph-ts"
import { CreditLine } from "../../../generated/schema"
import { CreditLineRewardClaimed } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleCreditLineRewardClaimed(event: CreditLineRewardClaimed): void {
  log.info("called CreditLineRewardClaimed handler", [])
  let creditLines = event.params.creditLines
  for (var i = 0; i < creditLines.length; i++) {
    let id = creditLines[i].underwritee.toHex() + "-" + creditLines[i].underwriter.toHex()
    let creditLine = CreditLine.load(id)
    if (creditLine == null) {
      return
    }
    creditLine.outstandingReward = creditLines[i].data.reward
    creditLine.save()
  }
}
