import { CreditRequestCreated } from "../../../generated/CreditRequest/CreditRequest"
import { CreditRequest, NetworkMember } from "../../../generated/schema"
export function handleCreditRequestCreated(event: CreditRequestCreated): void {
  let networkMember = NetworkMember.load(event.params.counterparty.toHex())
  if (!networkMember) {
    return
  }
  let id = event.params.network.toHex() + "-" + event.params.counterparty.toHex()
  let creditRequest = CreditRequest.load(id)
  if (!creditRequest) {
    creditRequest = new CreditRequest(id)
    creditRequest.approved = false
    creditRequest.creditLimit = event.params.creditLimit
    creditRequest.networkMember = networkMember.id
    creditRequest.type = "new"
    creditRequest.save()
  }
}
