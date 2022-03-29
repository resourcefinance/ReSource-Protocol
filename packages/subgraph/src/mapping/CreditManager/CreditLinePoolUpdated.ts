import { CreditLinePoolUpdated } from "../../../generated/CreditManager/CreditManager"
import { CreditLine } from "../../../generated/schema"

export function handleCreditLinePoolUpdated(event: CreditLinePoolUpdated): void {
  let id = event.params.network.toHex() + "-" + event.params.networkMember.toHex()
  let creditLine = CreditLine.load(id)
  if (!creditLine) {
    return
  }
  creditLine.pool = event.params.pool.toHex()
  creditLine.save()
}
