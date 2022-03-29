import { BigInt } from "@graphprotocol/graph-ts"
import { MemberAdded } from "../../../generated/NetworkRoles/NetworkRoles"
import { NetworkMember } from "../../../generated/schema"
import { log } from "@graphprotocol/graph-ts"

export function handleMemberAdded(event: MemberAdded): void {
  log.info("test", [])
  let networkMember = NetworkMember.load(event.params.member.toHex())
  if (!networkMember) {
    networkMember = new NetworkMember(event.params.member.toHex())
  }
  networkMember.save()
}
