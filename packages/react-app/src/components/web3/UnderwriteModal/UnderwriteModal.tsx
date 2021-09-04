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
import { Business } from "../../../generated/resource-network/graphql"
import Icon from "../../Icon"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CreditField, MuField, useSyncFields } from "./components/FormFields"
import UnderwriteMuButton from "./components/UnderwriteMuButton"

interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  const formik = useUnderwriteFormik()

  useSyncFields(formik)

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
            <MuField formik={formik} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <ApproveMuButton />
            <UnderwriteMuButton
              collateralAmount={formik.values.mu}
              creditLineAmount={formik.values.rusd}
              underwritee={business.wallet!.multiSigAddress!}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const validation = yup.object({
  mu: yup.string().required("staked mu value is required"),
  rusd: yup.string().required("credit line is required"),
})

const useUnderwriteFormik = () => {
  return useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { mu: 0, rusd: 0 },
    onSubmit: async (values: { mu: number; rusd: number }) => {},
  })
}

export default UnderwriteModal
