import { Box, BoxProps, Text } from "@chakra-ui/layout"
import { ButtonProps, HStack, Image, Input, InputProps } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import muLogo from "../../../../assets/mu.svg"
import colors, { gradients } from "../../../../theme/foundations/colors"
import { body, caption, title } from "../../../../theme/textStyles"
import Button from "../../../Button"
import FormikField from "../../../FormikField"
import { GradientGlyphPurple } from "../../../glyph/Glyph"
import { MIN_CREDIT_LINE } from "../utils"

interface Props extends BoxProps {
  formik: any
  extendCredit?: boolean
}

export const CreditField = ({ formik, extendCredit, ...rest }: Props) => {
  const label = `Credit to ${extendCredit ? "extend" : "assign"} & underwrite`
  const setMin = () => formik.setValues({ ...formik.values, credit: MIN_CREDIT_LINE })

  useEffect(() => {
    const updateCollateral = async () => {
      await formik.setFieldValue("collateral", formik.values.credit)
      await formik.setValues({ ...formik.values, collateral: formik.values.credit })
    }
    updateCollateral()
  }, [formik.values.credit])

  return (
    <Box {...containerStyles} {...rest}>
      <HStack justify="space-between">
        <Text color="gray.700">{label}</Text>
        {!extendCredit && <Text color="gray.500">min = {MIN_CREDIT_LINE.toFixed(2)}</Text>}
      </HStack>
      <HStack align="center" justify="space-between">
        <FormikField formik={formik} formikKey="credit">
          <Input {...creditInputStyles} />
        </FormikField>
        <HStack align="center">
          {!extendCredit && (
            <Button {...minButtonStyles} onClick={setMin}>
              MIN
            </Button>
          )}
          <GradientGlyphPurple boxSize="36px" />
        </HStack>
      </HStack>
    </Box>
  )
}

export const CollateralField = ({ formik, ...rest }: Props) => {
  useEffect(() => {
    const updateCredit = async () => {
      await formik.setFieldValue("credit", formik.values.collateral)
      await formik.setValues({ ...formik.values, credit: formik.values.collateral })
    }
    updateCredit()
  }, [formik.values.collateral])

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
        <FormikField formik={formik} formikKey="collateral">
          <Input {...collateralInputStyles} />
        </FormikField>
        <HStack align="center">
          <Image src={muLogo} boxSize="40px" />
        </HStack>
      </HStack>
    </Box>
  )
}

const baseInputStyles: InputProps = {
  ...title,
  type: "number",
  bgClip: "text",
  fontWeight: 600,
  placeholder: "0.00",
  variant: "unstyled",
  borderRadius: "2px",
  border: "transparent",
}

const creditInputStyles: InputProps = {
  ...baseInputStyles,
  bg: gradients.primary,
  sx: { caretColor: colors.primary.main },
}

const collateralInputStyles: InputProps = {
  ...baseInputStyles,
  bg: gradients.blue,
  sx: { caretColor: colors.blue.main },
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
