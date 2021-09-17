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
import { CONTRACTS } from "../../../constants"
import { Business } from "../../../generated/resource-network/graphql"
import {
  GetTotalCollateralDocument,
  GetUnderwriteeDocument,
} from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { parseEther } from "../../../services/web3/utils/etherUtils"
import { waitForTxEvent } from "../../../services/web3/utils/waitForTxEvent"
import { ModalProps } from "../../../utils/types"
import { useRefetchData } from "../../../utils/useRefetchData"
import { useTxToast } from "../../../utils/useTxToast"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import { CollateralField, CreditField } from "./components/FormFields"
import StakeButton from "./components/StakeButton"
import { MIN_CREDIT_LINE, useIsApprovedState } from "./utils"

interface UnderwriteModalProps extends ModalProps {
  business: Business
}

const validation = yup.object({
  collateral: yup.number().required("staked mu value is required"),
  credit: yup
    .number()
    .min(MIN_CREDIT_LINE)
    .required("credit line is required"),
})

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const { underwrite } = useUnderwriteManagerContract()
  const underwritee = business.wallet?.multiSigAddress
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved] = useIsApprovedState()
  const refetchData = useRefetchData()
  const toast = useTxToast()

  const formik = useFormik({
    validateOnChange: true,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {
      setIsLoading(true)
      try {
        const tx = await underwrite({
          collateralAmount: parseEther(values.collateral),
          networkTokenAddress: CONTRACTS.RUSDToken,
          underwritee: underwritee!,
        })
        const confirmed = await waitForTxEvent(tx, "NewCreditLine")
        if (confirmed) {
          await refetchData({
            queryNames: [GetTotalCollateralDocument, GetUnderwriteeDocument],
            contractNames: ["balanceOf"],
            options: { delay: 2000 },
          })
          toast({ description: "Business underwritten", status: "success" })
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

  if (!underwritee) return null

  return (
    <FormikProvider value={formik}>
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

export default UnderwriteModal
