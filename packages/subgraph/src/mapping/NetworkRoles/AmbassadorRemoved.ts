import { store } from "@graphprotocol/graph-ts"
import { AmbassadorRemoved } from "../../../generated/NetworkRoles/NetworkRoles"
import { Ambassador } from "../../../generated/schema"

export function handleAmbassadorRemoved(event: AmbassadorRemoved): void {
  let ambassador = Ambassador.load(event.params.ambassador.toHex())
  if (!ambassador) {
    return
  }
  store.remove("Ambassador", event.params.ambassador.toHex())
}
