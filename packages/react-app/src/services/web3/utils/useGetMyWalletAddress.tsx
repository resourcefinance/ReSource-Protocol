import { useWeb3Context as useContext } from "web3-react"

export const useGetMyWalletAddress = () => {
  return useContext().account?.toLowerCase()
}
