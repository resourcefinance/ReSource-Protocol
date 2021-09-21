import { Box, BoxProps, Text } from "@chakra-ui/layout"
import { ButtonProps, HStack, Image, Input, InputProps } from "@chakra-ui/react"
import { BigNumberish } from "ethers"
import React, { useEffect, useState } from "react"
import muLogo from "../../../../assets/glyphs/mu.svg"
import Button from "../../../../components/Button"
import FormikField from "../../../../components/FormikField"
import { GradientGlyphPurple } from "../../../../components/glyph/RusdGlyph"
import { useMututalityTokenContract } from "../../../../services/web3/contracts"
import { formatEther } from "../../../../services/web3/utils/etherUtils"
import colors, { gradients } from "../../../../theme/foundations/colors"
import { body, caption, title } from "../../../../theme/textStyles"
import { MIN_CREDIT_LINE } from "../utils"

interface Props extends BoxProps {
  formik: any
  extendCredit?: boolean
}

export const CreditField = ({ formik, extendCredit, ...rest }: Props) => {
  const label = `Credit to ${extendCredit ? "extend" : "assign"} & underwrite`
  const setMin = () => formik.setValues({ ...formik.values, credit: MIN_CREDIT_LINE })

  useEffect(() => {
    formik.setFieldValue("collateral", formik.values.credit)
  }, [formik.values.credit])

  return (
    <Box {...containerStyles} {...rest}>
      <HStack justify="space-between">
        <Text color="gray.700">{label}</Text>
        {!extendCredit && <Text color="gray.500">min = {MIN_CREDIT_LINE.toFixed(2)}</Text>}
      </HStack>
      <HStack align="center" justify="space-between">
        <FormikField formik={formik} formikKey="credit" hideErrorMessage>
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

export const CollateralField = ({ formik, extendCredit, ...rest }: Props) => {
  const [balance, setBalance] = useState<BigNumberish>(0)
  const { balanceOf } = useMututalityTokenContract()

  useEffect(() => {
    balanceOf().then((bal) => setBalance(bal))
  }, [])

  useEffect(() => {
    formik.setFieldValue("credit", formik.values.collateral)
  }, [formik.values.collateral])

  return (
    <Box {...containerStyles} {...rest}>
      <HStack justify="space-between">
        <Box noOfLines={1} minW="350px">
          <Text as="span" color="gray.700">
            SOURCE to stake
          </Text>
          <Text as="span" {...caption} mx={1} color="gray.500">
            (1 SOURCE = 0.2 rUSD, Leverage = 5x)
          </Text>
        </Box>
        <Text color="gray.500" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          Balance: {formatEther(balance)}
        </Text>
      </HStack>
      <HStack align="center" justify="space-between">
        <FormikField formik={formik} formikKey="collateral" hideErrorMessage>
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
