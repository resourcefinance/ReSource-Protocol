import { useWeb3Context } from "web3-react"
import { ethers } from "ethers"
import { CONTRACTS } from "../../constants"
import { MutualityToken__factory } from "../../contracts/factories/MutualityToken__factory"
import { MutualityToken } from "../../contracts/MutualityToken"
import { Web3Context } from "web3-react/dist/context"

export const useApprove = () => {
  const context = useWeb3Context()

  return async () => {
    const provider = new ethers.providers.Web3Provider(context.library.provider)
    const signer = provider.getSigner()

    const mutualityToken = new ethers.Contract(
      CONTRACTS.MutualityToken,
      MutualityToken__factory.createInterface(),
      provider,
    ) as MutualityToken

    console.log(mutualityToken)

    await mutualityToken
      .connect(signer)
      .approve(
        CONTRACTS.UnderwriteManager,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      )
  }
}

export const useCheckApproved = () => {
  const context = useWeb3Context()

  return async () => {
    if (!context.account) return false
    const provider = new ethers.providers.Web3Provider(context.library.provider)

    const mutualityToken = new ethers.Contract(
      CONTRACTS.MutualityToken,
      MutualityToken__factory.createInterface(),
      provider,
    ) as MutualityToken
    return Number(await mutualityToken.allowance(context.account, CONTRACTS.UnderwriteManager)) > 0
  }
}
