import { CreditLineLimitUpdated } from "../../../generated/CreditManager/CreditManager"
import { CreditLine } from "../../../generated/schema"

export function handleCreditLineLimitUpdated(event: CreditLineLimitUpdated): void {
  let id = event.params.network.toHex() + "-" + event.params.counterparty.toHex()
  let creditLine = CreditLine.load(id)
  if (!creditLine) {
    return
  }
  creditLine.creditLimit = event.params.creditLimit
  creditLine.save()
}
