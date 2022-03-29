import { store } from "@graphprotocol/graph-ts"
import { CreditLineRemoved } from "../../../generated/CreditManager/CreditManager"
import { CreditLine } from "../../../generated/schema"

export function handleCreditLineRemoved(event: CreditLineRemoved): void {
  let id = event.params.network.toHex() + "-" + event.params.networkMember.toHex()
  let creditLine = CreditLine.load(id)
  if (!creditLine) {
    return
  }
  store.remove("CreditLine", id)
}
