import { HStack, Input, VStack } from "@chakra-ui/react"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Form, FormikProvider, useFormik } from "formik"
import React from "react"
import * as valid from "yup"
import { Business } from "../../../generated/resource-network/graphql"
import colors from "../../../theme/foundations/colors"
import FormikField from "../../FormikField"
import ApproveMuButton from "./ApproveMuButton"
import UnderwriteMuButton from "./UnderwriteMuButton"

interface UnderwriteMuFormProps {
  business: Business
}

const validation = valid.object({
  mu: valid.string().required("staked mu value is required"),
  rusd: valid.string().required("credit line is required"),
})

export const UnderwriteForm = ({ business }: UnderwriteMuFormProps) => {
  const formik = useFormik({
    validateOnChange: false,
    validationSchema: validation,
    initialValues: { mu: 0, rusd: 0 },
    onSubmit: async (values: { mu: number; rusd: number }) => {},
  })

  return (
    <FormikProvider value={formik}>
      <Form>
        <VStack spacing={4}>
          <FormikField formikKey="rusd" formik={formik} title="Credit to assign & underwrite">
            <Input />
          </FormikField>
          <FontAwesomeIcon icon={faLink} color={colors.gray[500]} />
          <FormikField
            formikKey="mu"
            formik={formik}
            title="Mu to stake (1 MU = 0.2 rUSD, Leverage = 5x)"
          >
            <Input />
          </FormikField>
          <HStack py={4} w="full" justify="flex-end">
            <ApproveMuButton />
            <UnderwriteMuButton
              collateralAmount={formik.values.mu}
              creditLineAmount={formik.values.rusd}
              underwritee={business.wallet!.multiSigAddress!}
            />
          </HStack>
        </VStack>
      </Form>
    </FormikProvider>
  )
}
