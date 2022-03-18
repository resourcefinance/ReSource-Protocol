import { CreditLineRenewed } from "../../../generated/CreditManager/CreditManager"
import { CreditLine } from "../../../generated/schema"

export function handleCreditLineRenewed(event: CreditLineRenewed): void {
  let id = event.params.network.toHex() + "-" + event.params.counterparty.toHex()
  let creditLine = CreditLine.load(id)
  if (!creditLine) {
    return
  }
  creditLine.issueDate = event.params.timestamp
  creditLine.save()
}
