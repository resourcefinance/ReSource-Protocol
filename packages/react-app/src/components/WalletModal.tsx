import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
} from "@chakra-ui/react"
import Button from "./Button"
import { useWeb3Context } from "web3-react"
import { ethers } from "ethers"
import { getAbbreviatedAddress } from "../utils/stringFormat"
import { useEffect, useState } from "react"

const WalletModal = ({ isOpen, onClose }) => {
  const context = useWeb3Context()
  const [errorMessage, setErrorMessage] = useState("")

  const connect = () => {
    if (!context.active) context.setFirstValidConnector(["MetaMask"])
    else {
      const provider = new ethers.providers.Web3Provider(context.library.provider)
    }
    console.log(context)
    if (context.error?.message.includes("Unsupported Network")) {
      setErrorMessage("Please change your network to Celo")
    }
  }

  useEffect(() => {
    if (context.error?.message.includes("Unsupported Network")) {
      setErrorMessage("Please change your network to Celo")
    } else if (context.error?.message.includes("Unable to set any valid connector")) {
      setErrorMessage("Wallet refused connection")
    } else if (context.error?.message.includes("Ethereum account locked.")) {
      window.location.reload()
    } else {
      setErrorMessage("")
    }
    if (context.active) onClose()
  }, [context])

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>Conect your wallet</ModalHeader>
        <ModalBody>
          <Button
            width="100%"
            justifyContent="space-between"
            rightIcon={
              <Image
                width="2em"
                src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
              />
            }
            // disabled={context.active}
            size="lg"
            onClick={connect}
          >
            {context.active ? getAbbreviatedAddress(context.account || "") : "Connect Wallet"}
          </Button>
          <Text mt="2em">
            Connect to a wallet holding MU tokens to access staking and underwriting
          </Text>
        </ModalBody>
        <ModalFooter>
          <Text>{errorMessage}</Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WalletModal
