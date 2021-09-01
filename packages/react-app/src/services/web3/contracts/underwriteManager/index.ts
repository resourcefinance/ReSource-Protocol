import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { UnderwriteManager, UnderwriteManager__factory } from "../../../../contracts"
import { CONTRACTS } from "../../constants"
import { useGetEthersProviderAndSigner } from "../../utils/useGetEthersProviderAndSigner"

interface UnderwriteProps {
  networkTokenAddress: string
  collateralAmount: string
  underwritee: string
}
interface ClaimRewardsProps {
  underwritees: string[]
}

export const useUnderwriteManagerContract = () => {
  const { provider, signer } = useGetEthersProviderAndSigner()
  const [contract, setContract] = useState<UnderwriteManager>(
    getUnderwriteManagerContract(provider),
  )

  useEffect(() => {
    setContract(getUnderwriteManagerContract(provider))
  }, [provider])

  return {
    contract,
    underwrite: ({ collateralAmount, underwritee, networkTokenAddress }: UnderwriteProps) =>
      contract.connect(signer).underwrite(networkTokenAddress, collateralAmount, underwritee),
    claimReward: ({ underwritees }: ClaimRewardsProps) =>
      contract.connect(signer).claimRewards(underwritees),
  }
}

const getUnderwriteManagerContract = (provider: ethers.providers.Web3Provider) =>
  new ethers.Contract(
    CONTRACTS.UnderwriteManager,
    UnderwriteManager__factory.createInterface(),
    provider,
  ) as UnderwriteManager
