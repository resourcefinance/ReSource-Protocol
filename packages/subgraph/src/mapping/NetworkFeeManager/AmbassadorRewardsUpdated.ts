import { AmbassadorRewardsUpdated } from "../../../generated/NetworkFeeManager/NetworkFeeManager"
import { Ambassador } from "../../../generated/schema"
export function handleAmbassadorRewardsUpdated(event: AmbassadorRewardsUpdated): void {
  let ambassador = Ambassador.load(event.params.ambassador.toHex())
  if (!ambassador) {
    return
  }
  ambassador.rewards = event.params.totalRewards
  ambassador.save()
}
