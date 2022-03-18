import { AmbassadorAdded } from "../../../generated/NetworkRoles/NetworkRoles"
import { Ambassador } from "../../../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleAmbassadorAdded(event: AmbassadorAdded): void {
  let ambassador = Ambassador.load(event.params.ambassador.toHex())
  if (!ambassador) {
    ambassador = new Ambassador(event.params.ambassador.toHex())
  }
  ambassador.creditAllowance = event.params.creditAllowance
  ambassador.rewards = new BigInt(0)
  ambassador.save()
}
