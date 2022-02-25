import { BigInt } from "@graphprotocol/graph-ts"
import { MemberAdded } from "../../../generated/NetworkRoles/NetworkRoles"
import { NetworkMember } from "../../../generated/schema"

export function handleMemberAdded(event: MemberAdded): void {
  let networkMember = NetworkMember.load(event.params.member.toHex())
  if (!networkMember) {
    networkMember = new NetworkMember(event.params.member.toHex())
    networkMember.sourceBalance = new BigInt(0)
  }
  networkMember.save()
}
