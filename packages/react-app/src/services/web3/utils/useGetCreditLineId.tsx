import { useWeb3Context } from "web3-react"
import { Business } from "../../../generated/resource-network/graphql"

export const useGetCreditLineId = (business?: Business | null) => {
  const { account } = useWeb3Context()
  const businessMultiSig = business?.wallet?.multiSigAddress
  if (!account || !businessMultiSig) return ""
  return `${businessMultiSig.toLowerCase()}-${account.toLowerCase()}`
}
