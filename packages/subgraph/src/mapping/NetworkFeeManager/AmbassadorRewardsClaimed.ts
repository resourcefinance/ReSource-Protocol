import { RewardsClaimed } from "../../../generated/NetworkFeeManager/NetworkFeeManager"
import { Ambassador } from "../../../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleAmbassadorRewardsClaimed(event: RewardsClaimed): void {
  let ambassador = Ambassador.load(event.params.claimer.toHex())
  if (ambassador) {
    ambassador.rewards = new BigInt(0)
    ambassador.save()
  }
}
