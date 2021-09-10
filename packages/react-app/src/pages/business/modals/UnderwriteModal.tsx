import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { useFormik } from "formik"
import React from "react"
import * as yup from "yup"
import Icon from "../../../components/Icon"
import { Business } from "../../../generated/resource-network/graphql"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CollateralField, CreditField } from "./components/FormFields"
import UnderwriteButton from "./components/UnderwriteButton"

interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  const formik = useUnderwriteFormik()

  if (!underwritee) return null

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Underwrite Business
          <ModalCloseButton mt={2} />
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={5}>
            <BusinessHeader business={business} />
            <CreditField formik={formik} />
            <Icon icon={faLink} alignSelf="center" />
            <CollateralField formik={formik} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <ApproveMuButton />
            <UnderwriteButton formik={formik} underwritee={underwritee} onClick={onClose} />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const validation = yup.object({
  collateral: yup.string().required("staked mu value is required"),
  credit: yup.string().required("credit line is required"),
})

const useUnderwriteFormik = () => {
  return useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {},
  })
}

export default UnderwriteModal
