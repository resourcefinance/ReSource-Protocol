import {
  Box,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  Button,
} from "@chakra-ui/react"
import { faBookOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import celo from "../../assets/web3/celo-wallet-extension.svg"
import ledger from "../../assets/web3/ledger.svg"
import config from "../../config"
import { useLoadReSourceTokenBalance } from "../../services/web3/utils/useLoadReSourceTokenBalance"
import { getAbbreviatedAddress } from "../../utils/stringFormat"

const metaMaskIcon = "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"

const ConnectWalletModal = ({ isOpen, onClose }) => {
  const callToActionModal = useDisclosure()
  const context = useWeb3Context()
  const [callToAction, setCallToAction] = useState(false)
  const errorMessage = useConnectorErrorMessage(setCallToAction)

  useEffect(() => {
    if (callToAction && isOpen && context.active) callToActionModal.onOpen()
    else callToActionModal.onClose()
  }, [callToAction, isOpen])

  const connect = () => context.setFirstValidConnector(["MetaMask"])

  return (
    <>
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
            </VStack>
            <Text mt="2em">
              Connect to a wallet holding SOURCE tokens to access staking and underwriting
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack alignItems="center">
              <Text color="red.main">{errorMessage}</Text>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CallToActionModal isOpen={callToActionModal.isOpen} onClose={callToActionModal.onOpen} />
    </>
  )
}

const requestAddNetwork = async () => {
  const _window = window as any
  await _window.ethereum.request({
    method: "wallet_addEthereumChain",

    params: [
      {
        chainId: "0xaef3",
        chainName: "Alfajores Testnet",
        nativeCurrency: { name: "Alfajores Celo", symbol: "A-CELO", decimals: 18 },
        rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
        blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"],
        iconUrls: ["future"],
      },
    ],
  })
}

const requestChangeAccount = async () => {
  const _window = window as any
  await _window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  })
}

const useConnectorErrorMessage = (setCallToAction) => {
  const context = useWeb3Context()
  const [message, setMessage] = useState("")
  const sourceTokenBalance = useLoadReSourceTokenBalance()
  console.log(sourceTokenBalance)

  useEffect(() => {
    setCallToAction(false)
    if (
      context.error?.message.includes("Unsupported Network") ||
      context.error?.message.includes("Unable to set any valid connector") ||
      context.error?.message.includes("Unsupported Network")
    ) {
      requestAddNetwork()
    } else if (context.account && sourceTokenBalance && sourceTokenBalance?.eq(0)) {
      console.log(sourceTokenBalance)
      setCallToAction(true)
    } else if (context.error?.message.includes("Ethereum account locked.")) {
      window.location.reload()
    } else {
      setMessage("")
    }
  }, [context, sourceTokenBalance])

  return message
}
export default ConnectWalletModal

export const CallToActionModal = ({ isOpen, onClose }) => {
  const context = useWeb3Context()

  const changeWallet = () => {
    context.unsetConnector()
    requestChangeAccount()
  }

  return (
    <Modal size="sm" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>You must be a SOURCE holder to underwrite</ModalHeader>
        <ModalBody pb="2em">
          <VStack align="stretch">
            <Button
              size="lg"
              onClick={changeWallet}
              colorScheme="blue"
              variant="outline"
              justifyContent="space-between"
              rightIcon={<Image width="2em" src={metaMaskIcon} />}
            >
              Change Wallet
            </Button>
            <Button
              as={"a"}
              href={"https://resource.finance/"}
              target={"_blank"}
              size="lg"
              colorScheme="blue"
              justifyContent="space-between"
              rightIcon={<FontAwesomeIcon icon={faBookOpen} />}
            >
              Learn More
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
