import { Box, BoxProps } from "@chakra-ui/layout"
import { Center, HStack, Text, Tooltip, useDisclosure } from "@chakra-ui/react"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import { useFetchWallet, useGetWallet } from "../../store/wallet"
import colors from "../../theme/foundations/colors"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import { GlyphLabel } from "../glyph/MuGlyphLabel"
import WalletInfoModal from "./WalletInfoModal"

const WalletInfo = ({ ...rest }: BoxProps) => {
  const context = useWeb3Context()
  const walletInfoModal = useDisclosure()
  const { balance, totalCollateral, loading: balanceLoading, error: balanceError } = useGetWallet()
  const fetchWallet = useFetchWallet()

  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {
    const setWallet = async () => {
      if (!context.library) {
        setWalletAddress("")
        return false
      }
      const provider = new ethers.providers.Web3Provider(context.library.provider)
      setWalletAddress(await provider.getSigner().getAddress())
      if (provider && context.account) {
        fetchWallet()
      }
    }
    setWallet()
  }, [context])

  return (
    <Box {...rest}>
      <HStack spacing={-14}>
        <Tooltip label="Staked MU" shouldWrapChildren>
          <Center {...pillContainerStyles} pr="60px" left={0} borderColor={colors.blue.main}>
            <GlyphLabel color={colors.blue.main} mx={1} value={totalCollateral} />
          </Center>
        </Tooltip>
        <Tooltip label="MU balance" shouldWrapChildren>
          <Center {...pillContainerStyles} right={0} borderColor="black">
            <GlyphLabel mx={1} value={balance} />
          </Center>
        </Tooltip>
        {walletAddress && (
          <>
            <Center {...walletPillContainerStyles} onClick={walletInfoModal.onOpen}>
              <FontAwesomeIcon icon={faCircle} color={colors.green.main} />
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

export default WalletInfo
