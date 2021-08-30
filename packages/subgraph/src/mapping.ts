import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NewCreditLine,
  UpdateCreditLine,
  CreditLineReward,
  CreditLineRewardClaimed,
  CreditLineWithdrawal,
} from "../generated/UnderwriteManager/UnderwriteManager"
import { CreditLine } from "../generated/schema"

export function handleNewCreditLine(event: NewCreditLine): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "_" + event.params.creditLine.underwriter.toHex()
  let creditLine = new CreditLine(id)
  creditLine.underwritee = event.params.creditLine.underwritee
  creditLine.underwriter = event.params.creditLine.underwriter
  creditLine.collateral = event.params.creditLine.data.collateral
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.totalReward = new BigInt(0)
  creditLine.save()
}

export function handleUpdateCreditLine(event: UpdateCreditLine): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "_" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  if (creditLine == null) {
    return
  }
  creditLine.underwritee = event.params.creditLine.underwritee
  creditLine.underwriter = event.params.creditLine.underwriter
  creditLine.collateral = event.params.creditLine.data.collateral
  creditLine.networkToken = event.params.creditLine.data.networkToken
  creditLine.issueDate = event.params.creditLine.data.issueDate
  creditLine.outstandingReward = event.params.creditLine.data.reward
  creditLine.save()
}

export function handleCreditLineReward(event: CreditLineReward): void {
  let id =
    event.params.creditLine.underwritee.toHex() + "_" + event.params.creditLine.underwriter.toHex()
  let creditLine = CreditLine.load(id)
  if (creditLine == null) {
    return
  }
  creditLine.outstandingReward = event.params.creditLine.creditLine.reward
  creditLine.totalReward = creditLine.totalReward.plus(event.params.creditLine.creditLine.reward)
  creditLine.save()
}

export function handleCreditLineRewardClaimed(event: CreditLineRewardClaimed): void {
  let creditLines = event.params.creditLines
  for (var i = 0; i < creditLines.length; i++) {
    let id = creditLines[i].underwritee.toHex() + "_" + creditLines[i].underwriter.toHex()
    let creditLine = CreditLine.load(id)
    if (creditLine == null) {
      return
    }
    creditLine.outstandingReward = creditLines[i].creditLine.reward
    creditLine.save()
  }
}

export function handleCreditLineWithdrawal(event: CreditLineWithdrawal): void {}
