import { MembershipAmbassadorUpdated } from "../../../generated/NetworkRoles/NetworkRoles"
import { Ambassador, NetworkMember } from "../../../generated/schema"

export function handleMembershipAmbassadorUpdated(event: MembershipAmbassadorUpdated): void {
  let networkMember = NetworkMember.load(event.params.member.toHex())
  let ambassador = Ambassador.load(event.params.ambassador.toHex())
  if (!networkMember || !ambassador) {
    return
  }
  networkMember.ambassador = ambassador.id
  networkMember.save()
}
