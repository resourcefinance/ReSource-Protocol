import { store } from "@graphprotocol/graph-ts"
import { UnderwriterRemoved } from "../../../generated/CreditRoles/CreditRoles"
import { Underwriter } from "../../../generated/schema"
export function handleUnderwriterRemoved(event: UnderwriterRemoved): void {
  let underwriter = Underwriter.load(event.params.underwriter.toHex())
  if (!underwriter) {
    return
  }
  store.remove("Underwriter", event.params.underwriter.toHex())
}
