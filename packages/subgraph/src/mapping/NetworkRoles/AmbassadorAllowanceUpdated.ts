import { AmbassadorAllowanceUpdated } from "../../../generated/NetworkRoles/NetworkRoles"
import { Ambassador } from "../../../generated/schema"

export function handleAmbassadorAllowanceUpdated(event: AmbassadorAllowanceUpdated): void {
  let ambassador = Ambassador.load(event.params.ambassador.toHex())
  if (!ambassador) {
    return
  }
  ambassador.creditAllowance = event.params.creditAllowance
  ambassador.save()
}
