import { store } from "@graphprotocol/graph-ts"
import { CreditRequestRemoved } from "../../../generated/CreditRequest/CreditRequest"
import { CreditRequest } from "../../../generated/schema"
export function handleCreditRequestRemoved(event: CreditRequestRemoved): void {
  let id = event.params.network.toHex() + "-" + event.params.networkMember.toHex()
  let creditRequest = CreditRequest.load(id)
  if (!creditRequest) {
    return
  }
  store.remove("CreditRequest", id)
}
