import { CreditLineCreated } from "../../../generated/CreditManager/CreditManager"
import { CreditLine, NetworkMember } from "../../../generated/schema"

export function handleCreditLineCreated(event: CreditLineCreated): void {
  let networkMember = NetworkMember.load(event.params.networkMember.toHex())
  if (!networkMember) {
    return
  }
  let id = event.params.network.toHex() + "-" + event.params.networkMember.toHex()
  let creditLine = CreditLine.load(id)
  if (!creditLine) {
    creditLine = new CreditLine(id)
    creditLine.issueDate = event.params.timestamp
    creditLine.pool = event.params.pool.toHex()
    creditLine.network = event.params.network
    creditLine.creditLimit = event.params.creditLimit
    networkMember.creditLine = creditLine.id
    networkMember.save()
    creditLine.save()
  }
}
