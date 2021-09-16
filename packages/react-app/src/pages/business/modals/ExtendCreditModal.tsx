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
import { FormikProvider, useFormik } from "formik"
import React from "react"
import * as yup from "yup"
import Icon from "../../../components/Icon"
import { Business } from "../../../generated/resource-network/graphql"
import { useGetCreditLineQuery } from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { parseEther } from "../../../services/web3/utils/etherUtils"
import { useGetCreditLineId } from "../../../services/web3/utils/useGetCreditLineId"
import { waitForTxEvent } from "../../../services/web3/utils/waitForTxEvent"
import { useRefetchData } from "../../../utils/useRefetchData"
import { useTxToast } from "../../../utils/useTxToast"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CurrentUnderwriteMetrics, NewUnderwriteMetrics } from "./components/ExtendCreditLabels"
import { CollateralField, CreditField } from "./components/FormFields"
import StakeButton from "./components/StakeButton"
import { useIsApprovedState } from "./utils"

interface ExtendCreditModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const validation = yup.object({
  collateral: yup
    .number()
    .required("staked mu value is required")
    .min(0),
  credit: yup
    .number()
    .required("credit line is required")
    .min(0),
})

const ExtendCreditModal = ({ isOpen, onClose, business }: ExtendCreditModalProps) => {
  const { collateral, credit, loading, called } = useGetCreditLineData(business)
  const { extendCreditLine } = useUnderwriteManagerContract()
  const underwritee = business.wallet?.multiSigAddress?.toLowerCase()
  const [isApproved] = useIsApprovedState()
  const refetchData = useRefetchData()
  const toast = useTxToast()

  const formik = useFormik({
    validateOnChange: true,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {
      try {
        const collateralAmount = parseEther(values.collateral)
        const tx = await extendCreditLine({ collateralAmount, underwritee: underwritee! })
        const confirmed = await waitForTxEvent(tx, "ExtendCreditLine")
        if (confirmed) {
          toast({ description: "Approved", status: "success" })
          refetchData({
            queryNames: ["getTotalCollateral", "getCreditLines"],
            contractNames: ["balanceOf"],
            options: { delay: 2000 },
          })
          onClose()
        }
      } catch (error) {
        toast({ status: "error", description: parseRPCError(error) })
      }
    },
  })

  const maySubmit = () => {
    if (!formik.isValid) return false
    if (!underwritee) return false
    if (!isApproved) return false
    return true
  }

  if (!underwritee || loading || !called) return null

  return (
    <FormikProvider value={formik}>
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
              <StakeButton isDisabled={!maySubmit()} formik={formik} onClick={formik.submitForm} />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormikProvider>
  )
}

const useGetCreditLineData = (business: Business) => {
  const id = useGetCreditLineId(business)
  const { data, loading, called } = useGetCreditLineQuery({
    variables: { id },
    skip: !id,
  })
  const collateral = data?.creditLine?.collateral ?? 0
  const credit = data?.creditLine?.creditLimit ?? 0

  return { collateral, credit, loading, called }
}

export default ExtendCreditModal
