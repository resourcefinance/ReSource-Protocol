import {ethers} from "ethers"
import {useEffect, useState} from "react"
import {useWeb3Context} from "web3-react"
import {ResourceToken, ResourceToken__factory} from "../../../../contracts"
import {CONTRACTS} from "../../constants"
import {useGetEthersProviderAndSigner} from "../../utils/useGetEthersProviderAndSigner"

const APPROVED_VALUE = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

export const useMututalityTokenContract = () => {
  const context = useWeb3Context()
  const {provider, signer} = useGetEthersProviderAndSigner()
  const [contract, setContract] = useState<ResourceToken>(getResourceTokenContract(provider))

  useEffect(() => {
    setContract(getResourceTokenContract(provider))
  }, [provider])

  return {
    contract,
    approve: (value?: string) => {
      return contract.connect(signer).approve(CONTRACTS.UnderwriteManager, value ?? APPROVED_VALUE)
    },
    allowance: async () => {
      if (!context.account) throw new Error("web3 account not connected")
      return contract.allowance(context.account, CONTRACTS.UnderwriteManager)
    },
    balanceOf: async () => {
      return contract.connect(signer).balanceOf(await signer.getAddress())
    },
  }
}

const getResourceTokenContract = (provider: ethers.providers.Web3Provider) =>
  new ethers.Contract(
    CONTRACTS.ResourceToken,
    ResourceToken__factory.createInterface(),
    provider,
  ) as ResourceToken
