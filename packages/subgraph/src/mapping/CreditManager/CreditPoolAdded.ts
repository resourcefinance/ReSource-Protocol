import { CreditPoolAdded } from "../../../generated/CreditManager/CreditManager"
import { CreditPool, Underwriter } from "../../../generated/schema"

export function handleCreditPoolAdded(event: CreditPoolAdded): void {
  let underwriter = Underwriter.load(event.params.underwriter.toHex())
  if (!underwriter) {
  }
  let pool = new CreditPool(event.params.pool.toHex())
  pool.underwriter = underwriter.id
  pool.save()
}
