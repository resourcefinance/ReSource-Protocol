import {
  Avatar,
  Box,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { ViewStorefrontButton } from "../../../components/ViewStorefrontButton"
import { Business } from "../../../generated/graphql"
import { CONTRACTS } from "../../../services/web3/constants"
import { UnderwriteForm } from "./UnderwriteForm"

export interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  if (!underwritee) return null

  const BusinessHeader = () => {
    return (
      <HStack mt={3} mb={4} align="stretch" justify="flex-start">
        <Box>
          <Avatar mb={4} h="50px" w="50px" src={business.logoUrl ?? ""} />
        </Box>
        <Box>
          <Heading mx={1} size="header">
            {business.name}
          </Heading>
          <ViewStorefrontButton handle={business.handle} />
        </Box>
      </HStack>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>
          Underwrite Business
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <BusinessHeader />
          <UnderwriteForm business={business} />
        </ModalBody>
        {/* <ModalFooter></ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default UnderwriteModal
