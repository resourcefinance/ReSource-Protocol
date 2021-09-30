import {
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { faCircle, faCopy, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useWeb3Context } from "web3-react"
import config from "../../config"
import colors from "../../theme/foundations/colors"
import { getAbbreviatedAddress } from "../../utils/stringFormat"
import Button from "../Button"
import Icon from "../Icon"

export interface WalletInfoModalProps {
  isOpen: boolean
  onClose: () => void
  address: string
}

const WalletInfoModal = ({ isOpen, onClose, address }: WalletInfoModalProps) => {
  const { onCopy } = useClipboard(address)
  const context = useWeb3Context()
  const toast = useToast()

  const handleDisconnect = () => {
    context.unsetConnector()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight" isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>
          <HStack>
            <Heading size="subtitle">Wallet Connected</Heading>
            <Icon size="xs" icon={faCircle} color={colors.green.main} boxSize="32px" />
          </HStack>
        </ModalHeader>
        <ModalBody>
          <VStack
            border="1px solid"
            borderColor="gray.cement"
            borderRadius="2xl"
            align="stretch"
            p={4}
          >
            <HStack justifyContent="space-between">
              <Heading size="subheader">Connected with MetaMask</Heading>
              <Image
                width="2em"
                src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
              />
            </HStack>
            <HStack align="center">
              <Text h="16px">{getAbbreviatedAddress(address, { startLength: 12 })}</Text>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="copy"
                color="gray.cement"
                icon={<FontAwesomeIcon icon={faCopy} />}
                onClick={() => {
                  onCopy()
                  toast({ title: "Address copied", status: "info" })
                }}
              />
              <Link target="_blank" href={getLinkToAccount(address)}>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="explorer"
                  color="gray.cement"
                  icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
                />
              </Link>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="primary" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const getLinkToAccount = (address: string) =>
  `${config.NETWORK_EXPLORER_URL}/address/${address}/transactions`

export default WalletInfoModal
