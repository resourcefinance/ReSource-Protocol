import { Button, Text, Input, VStack, InputGroup, InputRightElement } from "@chakra-ui/react"
import { faCheckCircle, faLink, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Form, FormikProvider, useFormik } from "formik"
import React, { useEffect, useState } from "react"
import * as valid from "yup"
import { Business } from "../../../generated/resource-network/graphql"
import { useMututalityTokenContract } from "../../../services/web3/contracts"
import colors from "../../../theme/foundations/colors"
import FormikField from "../../FormikField"
import { useIsApprovedState } from "./utils"
import Glyph from "../../glyph/Glyph"

interface UnderwriteMuFormProps {
  business: Business
  submit: (collateralAmount: number) => Promise<void>
  approve: () => Promise<void>
}

const validation = valid.object({
  collateral: valid.string().required("staked mu value is required"),
  credit: valid.string().required("credit line is required"),
})

const MIN_CREDIT_LINE = 600

export const UnderwriteForm = ({ business, submit, approve }: UnderwriteMuFormProps) => {
  const formik = useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { collateral: 0, credit: 0 },
    onSubmit: async (values: { collateral: number; credit: number }) => {
      await submit(values.collateral)
    },
  })
  const isApproved = useIsApprovedState()
  const { allowance } = useMututalityTokenContract()
  const [insufficientAllowance, setInsufficientAllowance] = useState(true)

  const insufficientCreditLine = formik.values.credit < MIN_CREDIT_LINE

  useEffect(() => {
    allowance().then((res) => {
      setInsufficientAllowance(false)
    })
  }, [])

  useEffect(() => {
    const updateCollateral = async () => {
      await formik.setFieldValue("collateral", formik.values.credit)
      await formik.setValues({ ...formik.values, collateral: formik.values.credit })
    }
    updateCollateral()
  }, [formik.values.credit])

  useEffect(() => {
    const updateCredit = async () => {
      await formik.setFieldValue("credit", formik.values.collateral)
      await formik.setValues({ ...formik.values, credit: formik.values.collateral })
    }
    updateCredit()
  }, [formik.values.collateral])

  return (
    <FormikProvider value={formik}>
      <Form>
        <VStack spacing={4}>
          <InputGroup>
            <InputRightElement
              alignItems="flex-end"
              pb="1em"
              height="100%"
              children={<Glyph bgColor="purple" />}
            />
            <FormikField formikKey="credit" formik={formik} title="Credit to assign & underwrite">
              <Input autoComplete="off" size="lg" borderRadius="1em" p="2em" />
            </FormikField>
          </InputGroup>
          <FontAwesomeIcon icon={faLink} color={colors.gray[500]} />
          <InputGroup>
            <InputRightElement alignItems="flex-end" pb="1em" height="100%" children={<Glyph />} />
            <FormikField
              formikKey="collateral"
              formik={formik}
              title="Mu to stake (1 MU = 0.2 rUSD, Leverage = 5x)"
            >
              <Input autoComplete="off" size="lg" borderRadius="1em" p="2em" />
            </FormikField>
          </InputGroup>
          <VStack py={4} w="full" justify="flex-end">
            <Button
              colorScheme="blue"
              w="100%"
              variant="secondary"
              isDisabled={isApproved}
              leftIcon={<FontAwesomeIcon icon={isApproved ? faCheckCircle : faThumbsUp} />}
              onClick={async () => await approve()}
            >
              {isApproved ? "Approved" : "Approve"}
            </Button>
            <Text fontWeight="bold" color="gray.cement">
              |
            </Text>
            <Button
              colorScheme="blue"
              w="100%"
              isDisabled={!isApproved || insufficientCreditLine || insufficientAllowance}
              leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
              type={"submit"}
            >
              {insufficientCreditLine ? "Insufficient credit line" : "Stake MU"}
            </Button>
          </VStack>
        </VStack>
      </Form>
    </FormikProvider>
  )
}
