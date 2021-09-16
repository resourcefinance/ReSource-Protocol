import { CreditLine, Underwriter } from "../../../generated/schema"
import { CreditLineWithdrawal } from "../../../generated/UnderwriteManager/UnderwriteManager"

export function handleCreditLineWithdrawal(event: CreditLineWithdrawal): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  let previousCollateral = creditLine.collateral
  creditLine.collateral = event.params.creditLine.data.collateral
  creditLine.save()
  let underwriter = Underwriter.load(creditLine.underwriter)
  underwriter.totalCollateral = underwriter.totalCollateral.minus(previousCollateral)
  underwriter.save()
}
