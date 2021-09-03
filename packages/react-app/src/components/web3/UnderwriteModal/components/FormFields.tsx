import { Box, BoxProps, Text } from "@chakra-ui/layout"
import { ButtonProps, HStack, Image, Input, InputProps } from "@chakra-ui/react"
import React, { useEffect } from "react"
import muLogo from "../../../../assets/mu.svg"
import colors, { gradients } from "../../../../theme/foundations/colors"
import { body, caption, title } from "../../../../theme/textStyles"
import Button from "../../../Button"
import FormikField from "../../../FormikField"
import { GradientGlyphPurple } from "../../../glyph/Glyph"

interface Props extends BoxProps {
  formik: any
}
export const CreditField = ({ formik, ...rest }: Props) => {
  const setMin = () => formik.setValues({ ...formik.values, rusd: 500 })

  return (
    <Box {...containerStyles} {...rest}>
      <HStack justify="space-between">
        <Text color="gray.700">Credit to assign & underwrite</Text>
        <Text color="gray.500">min = 500.00</Text>
      </HStack>
      <HStack align="center" justify="space-between">
        <FormikField formik={formik} formikKey="rusd">
          <Input {...inputStyles} bg={gradients.primary} />
        </FormikField>
        <HStack align="center">
          <Button {...minButtonStyles} onClick={setMin}>
            MIN
          </Button>
          <GradientGlyphPurple boxSize="36px" />
        </HStack>
      </HStack>
    </Box>
  )
}

export const MuField = ({ formik, ...rest }: Props) => {
  return (
    <Box {...containerStyles} {...rest}>
      <HStack justify="space-between">
        <Box>
          <Text as="span" color="gray.700">
            Mu to stake
          </Text>
          <Text as="span" {...caption} mx={1} color="gray.500">
            (1 MU = 0.2 rUSD, Leverage = 5x)
          </Text>
        </Box>
        <Text color="gray.500">Balance: 100,000.00</Text>
      </HStack>
      <HStack align="center" justify="space-between">
        <FormikField formik={formik} formikKey="mu">
          <Input {...inputStyles} bg={gradients.blue} />
        </FormikField>
        <HStack align="center">
          <Image src={muLogo} boxSize="40px" />
        </HStack>
      </HStack>
    </Box>
  )
}

export const useSyncFields = (formik: any) => {
  const { rusd, mu } = formik.values
  useEffect(() => formik.setValues({ ...formik.values, mu: rusd / 5 }), [rusd])
  useEffect(() => formik.setValues({ ...formik.values, rusd: mu * 5 }), [mu])
}

const inputStyles: InputProps = {
  variant: "unstyled",
  ...title,
  type: "number",
  bgClip: "text",
  fontWeight: 600,
  border: "transparent",
  borderRadius: "2px",
}

const minButtonStyles: ButtonProps = {
  ...body,
  color: "gray.900",
  h: "32px",
  bgColor: "gray.300",
  _hover: { bgColor: "gray.500" },
  borderRadius: "12px",
  variant: "unstyled",
}

const containerStyles: BoxProps = {
  p: 2,
  px: 4,
  borderRadius: "2xl",
  border: `1px solid ${colors.gray[300]}`,
}

export default CreditField
