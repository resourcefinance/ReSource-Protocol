import {useWeb3Context} from "web3-react"
import {ethers} from "ethers"
import {CONTRACTS} from "../../constants"
import {MutualityToken__factory} from "../../contracts/factories/MutualityToken__factory"
import {MutualityToken} from "../../contracts/MutualityToken"
import {useToast} from "@chakra-ui/react"

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

    await mutualityToken
      .connect(signer)
      .approve(
        CONTRACTS.UnderwriteManager,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      )
  }
}

export const useGetMuBalance = () => {
  const context = useWeb3Context()

  return async () => {
    const provider = new ethers.providers.Web3Provider(context.library.provider)
    const signer = provider.getSigner()

    const mutualityToken = new ethers.Contract(
      CONTRACTS.MutualityToken,
      MutualityToken__factory.createInterface(),
      provider,
    ) as MutualityToken

    const address = await signer.getAddress()

    return ethers.utils.formatEther(await mutualityToken.connect(signer).balanceOf(address))
  }
}

export const useListenForApproval = () => {
  const context = useWeb3Context()
  const toast = useToast()

  return async (setIsApproved) => {
    const provider = new ethers.providers.Web3Provider(context.library.provider)

    const mutualityToken = new ethers.Contract(
      CONTRACTS.MutualityToken,
      MutualityToken__factory.createInterface(),
      provider,
    ) as MutualityToken

    mutualityToken.once("Approval", async (args) => {
      toast({
        description: "Approved",
        position: "top-right",
        status: "success",
        isClosable: true,
      })
      setIsApproved(true)
    })
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
