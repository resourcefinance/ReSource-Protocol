import { Box, BoxProps } from "@chakra-ui/layout"
import { Center, HStack, Text, useDisclosure } from "@chakra-ui/react"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useWeb3Context } from "web3-react"
import { CONTRACTS } from "../../constants"
import { MutualityToken, MutualityToken__factory } from "../../contracts"
import { useUnderwriterSubscription } from "../../generated/subgraph/graphql"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import GlyphLabel from "../glyph/GlyphLabel"
import WalletInfoModal from "./WalletInfoModal"

const pillContainerStyles: BoxProps = {
  bgColor: "white",
  borderRadius: "2xl",
  border: "1px solid",
  py: 1,
  px: 2,
}

const walletPillContainerStyles: BoxProps = {
  bgColor: "gray.cultured",
  borderRadius: "2xl",
  border: "1px solid gray.cultured",
  py: 1,
  px: 2,
  marginLeft: "1em !important",
}

const WalletInfo = ({ ...rest }: BoxProps) => {
  const history = useHistory()
  const context = useWeb3Context()
  const walletInfoModal = useDisclosure()
  const getMuBalance = useGetMuBalance()
  const underwriterSubscription = useUnderwriterSubscription({
    variables: { id: context.account || "" },
  })

  const { loading, data, error } = underwriterSubscription

  const [muBalance, setMuBalance] = useState("0.00")

  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {
    const setWallet = async () => {
      if (!context.library) {
        setWalletAddress("")
        return false
      }
      const provider = new ethers.providers.Web3Provider(context.library.provider)
      setWalletAddress(await provider.getSigner().getAddress())
      const balance = await getMuBalance()
      setMuBalance(balance)
    }
    setWallet()
  }, [context])

  return (
    <Box {...rest} cursor="pointer">
      <HStack spacing={-10}>
        <Center {...pillContainerStyles} left={0} borderColor="gray.700">
          <GlyphLabel
            loading={false}
            lineHeight="0"
            mx={2}
            pr={10}
            size="sm"
            variant="gradient"
            value={0}
          />
        </Center>
        <Center {...pillContainerStyles} right={0} borderColor="black">
          <GlyphLabel
            loading={false}
            lineHeight="0"
            mx={2}
            size="sm"
            variant="price"
            value={muBalance}
          />
        </Center>
        {walletAddress && (
          <>
            <Center {...walletPillContainerStyles} onClick={walletInfoModal.onOpen}>
              <FontAwesomeIcon icon={faCircle} color={"green"} />
              <Text as="span" lineHeight="2" mx={".5em"}>
                {getAbbreviatedAddress(walletAddress)}
              </Text>
            </Center>
            <WalletInfoModal
              isOpen={walletInfoModal.isOpen}
              onClose={walletInfoModal.onClose}
              address={walletAddress}
            />
          </>
        )}
      </HStack>
    </Box>
  )
}

const useGetMuBalance = () => {
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

export default WalletInfo
