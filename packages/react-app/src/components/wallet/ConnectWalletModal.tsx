import {
  Box,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import celo from "../../assets/web3/celo-wallet-extension.svg"
import ledger from "../../assets/web3/ledger.svg"
import { useLoadReSourceTokenBalance } from "../../services/web3/utils/useLoadReSourceTokenBalance"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import Button from "../Button"

const metaMaskIcon = "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"

const ConnectWalletModal = ({ isOpen, onClose }) => {
  const context = useWeb3Context()
  const errorMessage = useConnectorErrorMessage()

  const connect = () => context.setFirstValidConnector(["MetaMask"])

  return (
    <Modal size="sm" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>Connect your wallet</ModalHeader>
        <ModalBody>
          <VStack align="stretch">
            <Button
              size="lg"
              onClick={connect}
              colorScheme="blue"
              justifyContent="space-between"
              rightIcon={<Image width="2em" src={metaMaskIcon} />}
            >
              {context.active ? getAbbreviatedAddress(context.account || "") : "Connect Wallet"}
            </Button>
            {/* <ComingSoonConnectors /> */}
          </VStack>
          <Text mt="2em">
            Connect to a wallet holding SOURCE tokens to access staking and underwriting
          </Text>
        </ModalBody>
        <ModalFooter>
          <Text color="red.main">{errorMessage}</Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const ComingSoonConnectors = () => (
  <VStack align="stretch" spacing={3}>
    <Text color="gray.900" px={2} pt={4}>
      Coming soon...
    </Text>
    <HStack
      opacity={0.5}
      justify="space-between"
      border="1px solid gray"
      rounded="16px"
      h="50px"
      p={4}
    >
      <Text>Celo extension wallet</Text>
      <Image width="2em" src={celo} />
    </HStack>
    <HStack
      opacity={0.5}
      justify="space-between"
      border="1px solid gray"
      rounded="16px"
      h="50px"
      p={4}
    >
      <Text>Ledger</Text>
      <Image width="1.75em" src={ledger} />
    </HStack>
  </VStack>
)

const useConnectorErrorMessage = () => {
  const context = useWeb3Context()
  const [message, setMessage] = useState("")
  const sourceTokenBalance = useLoadReSourceTokenBalance()

  useEffect(() => {
    if (context.error?.message.includes("Unsupported Network")) {
      setMessage("Please change your network to Celo")
    } else if (context.error?.message.includes("Unable to set any valid connector")) {
      setMessage("Wallet refused connection, try changing your network")
    } else if (context.error?.message.includes("Unsupported Network")) {
      setMessage("Please change your network to Celo")
    } else if (context.account && sourceTokenBalance?.eq(0)) {
      setMessage("Wallet does not have required SOURCE tokens.")
    } else if (context.error?.message.includes("Ethereum account locked.")) {
      window.location.reload()
    } else {
      setMessage("")
    }
  }, [context.account, sourceTokenBalance])

  return message
}
export default ConnectWalletModal
