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
} from "@chakra-ui/react"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import celo from "../../assets/web3/celo-wallet-extension.svg"
import ledger from "../../assets/web3/ledger.svg"
import config from "../../config"
import { useLoadReSourceTokenBalance } from "../../services/web3/utils/useLoadReSourceTokenBalance"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import Button from "../Button"

const metaMaskIcon = "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"

const ConnectWalletModal = ({ isOpen, onClose }) => {
  const context = useWeb3Context()
  const errorMessage = useConnectorErrorMessage()
  const [networkError, setNetworkError] = useState(false)

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
          </VStack>
          <Text mt="2em">
            Connect to a wallet holding SOURCE tokens to access staking and underwriting
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack alignItems="center">
            <Text color="red.main">{errorMessage}</Text>
            {errorMessage.includes("network") && (
              <IconButton
                as={"a"}
                target={"_blank"}
                rel="noopener noreferrer"
                href={
                  "https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup"
                }
                size="sm"
                variant="ghost"
                aria-label="info"
                color="red.main"
                icon={<FontAwesomeIcon icon={faInfoCircle} />}
              />
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const useConnectorErrorMessage = () => {
  const context = useWeb3Context()
  const [message, setMessage] = useState("")
  const sourceTokenBalance = useLoadReSourceTokenBalance()

  useEffect(() => {
    if (
      context.error?.message.includes("Unsupported Network") ||
      context.error?.message.includes("Unable to set any valid connector") ||
      context.error?.message.includes("Unsupported Network")
    ) {
      setMessage(
        `Please change your network to ${config.NETWORK_NAME.replace("-", " ")
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.substring(1))
          .join(" ")}`,
      )
    } else if (context.account && sourceTokenBalance?.eq(0)) {
      setMessage("Wallet does not have required SOURCE tokens.")
    } else if (context.error?.message.includes("Ethereum account locked.")) {
      window.location.reload()
    } else {
      setMessage("")
    }
  }, [context, sourceTokenBalance])

  return message
}
export default ConnectWalletModal
