import { CreditRequestUpdated } from "../../../generated/CreditRequest/CreditRequest"
import { CreditRequest } from "../../../generated/schema"
export function handleCreditRequestUpdated(event: CreditRequestUpdated): void {
  let id = event.params.network.toHex() + "-" + event.params.counterparty.toHex()
  let creditRequest = CreditRequest.load(id)
  if (!creditRequest) {
    return
  }
  creditRequest.approved = event.params.approved
  creditRequest.creditLimit = event.params.creditLimit
  creditRequest.save()
}
