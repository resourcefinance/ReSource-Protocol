import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import React from "react"
import { Business } from "../../../generated/resource-network/graphql"
import { BusinessHeader } from "./components/BusinessHeader"

export interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const ExtendCreditModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  if (!underwritee) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>
          Underwrite Business
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <BusinessHeader business={business} />
          {/* <UnderwriteForm business={business} /> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ExtendCreditModal
