import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import { WalletConnectionNotFoundError } from "../../errors/errors"

export const useGetEthersProviderAndSigner = () => {
  const context = useWeb3Context()
  if (!context.library) throw WalletConnectionNotFoundError
  const [provider, setProvider] = useState(
    new ethers.providers.Web3Provider(context.library.provider),
  )
  const [signer, setSigner] = useState(provider.getSigner())

  useEffect(() => {
    const newProvider = new ethers.providers.Web3Provider(context.library.provider)
    setProvider(newProvider)
    setSigner(newProvider.getSigner())
  }, [context.library.provider])

  return { provider, signer }
}
