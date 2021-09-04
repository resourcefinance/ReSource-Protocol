import {
  Box,
  BoxProps,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  TextProps,
  VStack,
} from "@chakra-ui/react"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { useFormik } from "formik"
import React from "react"
import * as yup from "yup"
import { Business } from "../../../generated/resource-network/graphql"
import { gradients } from "../../../theme/foundations/colors"
import Icon from "../../Icon"
import ApproveMuButton from "./components/ApproveMuButton"
import { BusinessHeader } from "./components/BusinessHeader"
import CreditField, { MuField, useSyncFields } from "./components/FormFields"
import UnderwriteMuButton from "./components/UnderwriteMuButton"

interface ExtendCreditModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const ExtendCreditModal = ({ isOpen, onClose, business }: ExtendCreditModalProps) => {
  const underwritee = business.wallet?.multiSigAddress
  const formik = useExtendCreditFormik()

  useSyncFields(formik)

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
            <MuField formik={formik} extendCredit />
            <ProspectiveMetrics formik={formik} business={business} />
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

const useExtendCreditFormik = () => {
  return useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { mu: 0, rusd: 0 },
    onSubmit: async (values: { mu: number; rusd: number }) => {},
  })
}

interface Props extends BoxProps {
  business: Business
  formik?: any
}

const textStyles: TextProps = { as: "span", mx: 1 }

const CurrentUnderwriteMetrics = ({ business }: Props) => {
  return (
    <Box>
      <Text {...textStyles}>Credit line currently underwritten</Text>
      <Text {...textStyles} variant="number" bg={gradients.primary} bgClip="text">
        {10000}
      </Text>
      <Text {...textStyles} variant="caption">
        rUSD
      </Text>
      <Text {...textStyles} variant="caption">
        /
      </Text>
      <Text {...textStyles} variant="number" bg={gradients.blue} bgClip="text">
        {20}
      </Text>
      <Text {...textStyles} variant="caption">
        MU
      </Text>
    </Box>
  )
}

const ProspectiveMetrics = ({ formik, business }: Props) => {
  return (
    <Box>
      <Text {...textStyles}>New total credit line</Text>
      <Text {...textStyles} variant="number" bg={gradients.primary} bgClip="text">
        {10000}
      </Text>
      <Text {...textStyles} variant="caption">
        rUSD
      </Text>
      <Text {...textStyles} variant="caption">
        /
      </Text>
      <Text {...textStyles} variant="number" bg={gradients.blue} bgClip="text">
        {20}
      </Text>
      <Text {...textStyles} variant="caption">
        MU
      </Text>
    </Box>
  )
}

export default ExtendCreditModal
