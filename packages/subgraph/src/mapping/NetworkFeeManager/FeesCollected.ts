import { FeesCollected } from "../../../generated/CreditFeeManager/CreditFeeManager"
import { NetworkMember } from "../../../generated/schema"
export function handleFeesCollected(event: FeesCollected): void {
  let networkMember = NetworkMember.load(event.params.member.toHex())
  if (!networkMember) {
    networkMember = new NetworkMember(event.params.member.toHex())
    networkMember.totalFeesAccrued = networkMember.totalFeesAccrued.plus(event.params.totalFee)
  }
  networkMember.save()
}
