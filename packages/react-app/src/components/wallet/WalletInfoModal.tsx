import {
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
  useClipboard,
  useToast,
} from "@chakra-ui/react"
import { faCopy, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useWeb3Context } from "web3-react"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import Button from "../Button"

export interface WalletInfoModalProps {
  isOpen: boolean
  onClose: () => void
  address: string
}

const WalletInfoModal = ({ isOpen, onClose, address }: WalletInfoModalProps) => {
  const context = useWeb3Context()
  const { hasCopied, onCopy } = useClipboard(address)
  const toast = useToast()

  const handleDisconnect = () => {
    context.unsetConnector()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>Wallet Connected</ModalHeader>
        <ModalBody>
          <HStack justifyContent="space-between">
            <Text>Connected with MetaMask</Text>
            <Image
              width="2em"
              src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
            />
          </HStack>
          <HStack
            justifyContent="flex-start"
            p="1em"
            border="1px solid"
            borderColor="gray.cement"
            borderRadius="2xl"
            mt="1em"
          >
            <Text>{getAbbreviatedAddress(address)}</Text>
            <IconButton
              variant="ghost"
              aria-label="copy"
              color="gray.cement"
              icon={<FontAwesomeIcon icon={faCopy} />}
              onClick={() => {
                onCopy()
                toast({ title: "Address copied.", status: "info" })
              }}
            />
            <IconButton
              variant="ghost"
              aria-label="explorer"
              color="gray.cement"
              icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
            />
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WalletInfoModal
