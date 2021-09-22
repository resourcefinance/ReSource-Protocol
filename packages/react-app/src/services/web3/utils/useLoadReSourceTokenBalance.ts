import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import { getReSourceTokenContract } from "../contracts/reSourceToken"

export const useLoadReSourceTokenBalance = () => {
  const context = useWeb3Context()
  const [sourceBalance, setSourceBalance] = useState<BigNumber>()

  useEffect(() => {
    async function loadBalance() {
      if (context.account) {
        const provider = new ethers.providers.Web3Provider(context.library.provider)
        const signer = provider.getSigner()
        const contract = getReSourceTokenContract(provider)
        const address = await signer.getAddress()
        const balance = await contract.connect(signer).balanceOf(address)
        setSourceBalance(balance)
      }
    }

    loadBalance()
  }, [context.account])

  return sourceBalance
}
