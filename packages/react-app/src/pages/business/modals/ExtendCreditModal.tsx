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
import { useHistory } from "react-router-dom"
import * as yup from "yup"
import { Business } from "../../../generated/resource-network/graphql"
import Icon from "../../../components/Icon"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CurrentUnderwriteMetrics, ProspectiveMetrics } from "./components/ExtendCreditLabels"
import { CollateralField, CreditField } from "./components/FormFields"
import UnderwriteButton from "./components/UnderwriteButton"

interface ExtendCreditModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const ExtendCreditModal = ({ isOpen, onClose, business }: ExtendCreditModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  const formik = useExtendCreditFormik()
  const history = useHistory()

  if (!underwritee) return null

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Extend Credit
          <ModalCloseButton mt={2} />
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={5} mb={5}>
            <BusinessHeader business={business} />
            <CurrentUnderwriteMetrics business={business} />
            <CreditField formik={formik} extendCredit />
            <Icon icon={faLink} alignSelf="center" />
            <CollateralField formik={formik} extendCredit />
            <ProspectiveMetrics business={business} formik={formik} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <ApproveMuButton />
            <UnderwriteButton
              formik={formik}
              underwritee={underwritee}
              onClick={() => {
                onClose()
                history.push("/portfolio")
              }}
            />
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

const useExtendCreditFormik = () => {
  return useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {},
  })
}

export default ExtendCreditModal
