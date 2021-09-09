import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewCreditLine,
  CreditLineReward,
  CreditLineRewardClaimed,
  CreditLineWithdrawal,
  ExtendCreditLine,
} from "../generated/UnderwriteManager/UnderwriteManager"
import { CreditLine, Underwriter } from "../generated/schema"

export function handleNewCreditLine(event: NewCreditLine): void {
  let underwriter = Underwriter.load(event.params.creditLine.underwriter.toHex())
  if (!underwriter) {
    underwriter = new Underwriter(event.params.creditLine.underwriter.toHex())
    underwriter.totalCollateral = new BigInt(0)
    underwriter.totalRewards = new BigInt(0)
  }
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = new CreditLine(id)
  creditLine.underwritee = event.params.creditLine.underwritee
  creditLine.collateral = event.params.creditLine.data.collateral
  underwriter.totalCollateral = underwriter.totalCollateral.plus(
    event.params.creditLine.data.collateral,
  )
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.totalReward = new BigInt(0)
  creditLine.underwriter = event.params.creditLine.underwriter.toHex()
  creditLine.save()
  underwriter.save()
}

export function handleExtendCreditLine(event: ExtendCreditLine): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  if (creditLine == null) {
    return
  }
  creditLine.collateral = event.params.creditLine.data.collateral
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.save()
  let underwriter = Underwriter.load(event.params.creditLine.underwriter.toHex())
  underwriter.totalCollateral = underwriter.totalCollateral.plus(
    event.params.creditLine.data.collateral,
  )
  underwriter.save()
}

export function handleCreditLineReward(event: CreditLineReward): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "-" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  creditLine.outstandingReward = creditLine.outstandingReward.plus(
    event.params.creditLine.data.reward,
  )
  creditLine.totalReward = creditLine.totalReward.plus(event.params.creditLine.data.reward)
  creditLine.save()
  let underwriter = Underwriter.load(creditLine.underwriter)
  underwriter.totalRewards = underwriter.totalRewards.plus(event.params.creditLine.data.reward)
  underwriter.save()
}

export function handleCreditLineRewardClaimed(event: CreditLineRewardClaimed): void {
  let creditLines = event.params.creditLines
  for (var i = 0; i < creditLines.length; i++) {
    let id = creditLines[i].underwritee.toHex() + "-" + creditLines[i].underwriter.toHex()
    let creditLine = CreditLine.load(id)
    if (creditLine == null) {
      return
    }
    creditLine.outstandingReward = creditLines[i].data.reward
    creditLine.save()
  }
}

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
