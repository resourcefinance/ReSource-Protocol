import { Business } from "../../../generated/resource-network/graphql"
import { useGetMyWalletAddress } from "./useGetMyWalletAddress"

export const useGetCreditLineId = (business?: Business | null) => {
  const myWalletAddress = useGetMyWalletAddress()
  const businessMultiSig = business?.wallet?.multiSigAddress
  if (!myWalletAddress || !businessMultiSig) return ""
  return `${businessMultiSig}-${myWalletAddress}`
}
