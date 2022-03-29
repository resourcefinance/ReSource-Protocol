import { UnstakeRequestCreated } from "../../../generated/CreditRequest/CreditRequest"
import { CreditRequest, NetworkMember } from "../../../generated/schema"
export function handleUnstakeRequestCreated(event: UnstakeRequestCreated): void {
  let id = event.params.network.toHex() + "-" + event.params.networkMember.toHex()
  let creditRequest = CreditRequest.load(id)
  if (!creditRequest) {
    return
  }
  creditRequest.type = "unstake"
  creditRequest.save()
}
