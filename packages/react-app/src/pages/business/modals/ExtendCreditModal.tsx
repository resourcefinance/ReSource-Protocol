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
import { CurrentUnderwriteMetrics, NewUnderwriteMetrics } from "./components/ExtendCreditLabels"
import { CollateralField, CreditField } from "./components/FormFields"
import UnderwriteButton from "./components/UnderwriteButton"
import { useGetCreditLineId } from "../../../services/web3/utils/useGetCreditLineId"
import { useGetCreditLineQuery } from "../../../generated/subgraph/graphql"

interface ExtendCreditModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const ExtendCreditModal = ({ isOpen, onClose, business }: ExtendCreditModalProps) => {
  const formik = useExtendCreditFormik()
  const underwritee = business.wallet?.multiSigAddress
  const { collateral, credit, loading, called } = useGetCreditLineData(business)

  if (!underwritee || loading || !called) return null

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
            <CurrentUnderwriteMetrics collateral={collateral} credit={credit} />
            <CreditField formik={formik} extendCredit />
            <Icon icon={faLink} alignSelf="center" />
            <CollateralField formik={formik} extendCredit />
            <NewUnderwriteMetrics collateral={collateral} credit={credit} formik={formik} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <ApproveMuButton />
            <UnderwriteButton
              extendCredit
              formik={formik}
              underwritee={underwritee}
              onClick={onClose}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const useGetCreditLineData = (business: Business) => {
  const id = useGetCreditLineId(business)
  const { data, loading, called } = useGetCreditLineQuery({ variables: { id }, skip: !id })
  const collateral = data?.creditLine?.collateral ?? 0
  const credit = data?.creditLine?.creditLimit ?? 0

  return { collateral, credit, loading, called }
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
