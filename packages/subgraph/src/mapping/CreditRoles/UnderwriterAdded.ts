import { UnderwriterAdded } from "../../../generated/CreditRoles/CreditRoles"
import { Underwriter } from "../../../generated/schema"
import { BigInt, log } from "@graphprotocol/graph-ts"

export function handleUnderwriterAdded(event: UnderwriterAdded): void {
  let underwriter = Underwriter.load(event.params.underwriter.toHex())
  if (underwriter) {
    log.error("Underwriter truthy", [])
  } else {
    log.error("Underwriter falsy", [])
  }
  if (!underwriter) {
    underwriter = new Underwriter(event.params.underwriter.toHex())
    underwriter.rewards = new BigInt(0)
    underwriter.save()
  }
}
