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
import React, { useState } from "react"
import * as yup from "yup"
import Icon from "../../../components/Icon"
import { Business } from "../../../generated/resource-network/graphql"
import {
  GetUnderwriteeDocument,
  GetUnderwriterWalletInfoDocument,
  useGetUnderwriteeQuery,
} from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { parseEther } from "../../../services/web3/utils/etherUtils"
import { waitForTxEvent } from "../../../services/web3/utils/waitForTxEvent"
import { ModalProps } from "../../../utils/types"
import { useRefetchQueries } from "../../../utils/useRefetchData"
import { useTxToast } from "../../../utils/useTxToast"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CurrentUnderwriteMetrics, NewUnderwriteMetrics } from "./components/ExtendCreditLabels"
import { CollateralField, CreditField } from "./components/FormFields"
import StakeButton from "./components/StakeButton"
import { useIsApprovedState } from "./utils"

interface ExtendCreditModalProps extends ModalProps {
  business: Business
}

const validation = yup.object({
  collateral: yup
    .number()
    .required("collateral value is required")
    .moreThan(0),
  credit: yup
    .number()
    .required("credit line is required")
    .moreThan(0),
})

const ExtendCreditModal = ({ isOpen, onClose, business }: ExtendCreditModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { collateral, credit, loading, called } = useGetCreditLineData(business)
  const { extendCreditLine } = useUnderwriteManagerContract()
  const underwritee = business.wallet?.multiSigAddress?.toLowerCase()
  const [isApproved] = useIsApprovedState()
  const refetch = useRefetchQueries()
  const toast = useTxToast()

  const formik = useFormik({
    validateOnChange: true,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {
      setIsLoading(true)
      try {
        const collateralAmount = parseEther(values.collateral)
        const tx = await extendCreditLine({ collateralAmount, underwritee: underwritee! })
        const confirmed = await waitForTxEvent(tx, "ExtendCreditLine")
        if (confirmed) {
          await refetch([GetUnderwriteeDocument, GetUnderwriterWalletInfoDocument], { delay: 2000 })
          toast({ description: "Credit line extended", status: "success" })
          onClose()
        }
      } catch (error) {
        toast({ status: "error", description: parseRPCError(error) })
      } finally {
        setIsLoading(false)
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
              <StakeButton
                formik={formik}
                isLoading={isLoading}
                isDisabled={!maySubmit()}
                onClick={formik.submitForm}
              />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormikProvider>
  )
}

const useGetCreditLineData = (business: Business) => {
  const id = business?.wallet?.multiSigAddress?.toLowerCase() ?? ""
  const { data, loading, called } = useGetUnderwriteeQuery({ variables: { id: id }, skip: !id })
  const collateral = data?.underwritee?.creditLine?.collateral ?? 0
  const credit = data?.underwritee?.creditLine?.creditLimit ?? 0

  return { collateral, credit, loading, called }
}

export default ExtendCreditModal
