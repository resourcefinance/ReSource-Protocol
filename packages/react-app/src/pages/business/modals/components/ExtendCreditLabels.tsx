import { Box, BoxProps, Text, TextProps } from "@chakra-ui/react"
import { BigNumberish } from "ethers"
import React from "react"
import {
  formatEther,
  formatMwei,
  parseEther,
  parseMwei,
} from "../../../../services/web3/utils/etherUtils"
import { gradients } from "../../../../theme/foundations/colors"

const textStyles: TextProps = { as: "span", mx: 1, variant: "caption" }

interface Props extends BoxProps {
  formik?: any
  collateral: BigNumberish
  credit: BigNumberish
}

export const CurrentUnderwriteMetrics = ({ collateral, credit }: Props) => {
  return (
    <Box as="span">
      <Text {...textStyles}>Credit line currently underwritten</Text>
      <LeverageRatio collateral={collateral} credit={credit} />
    </Box>
  )
}

export const NewUnderwriteMetrics = ({ collateral, credit, formik }: Props) => {
  const newCollateral = parseEther(formik.values.collateral).add(collateral)
  const newCredit = parseMwei(formik.values.credit).add(credit)

  return (
    <Box as="span">
      <Text {...textStyles}>New total credit line</Text>
      <LeverageRatio collateral={newCollateral} credit={newCredit} />
    </Box>
  )
}

interface LeverageRatioProps extends BoxProps {
  collateral: BigNumberish
  credit: BigNumberish
}

const LeverageRatio = ({ collateral, credit }: LeverageRatioProps) => {
  return (
    <Box as="span">
      <Text {...textStyles} variant="number" bg={gradients.primary} bgClip="text">
        {formatMwei(credit)}
      </Text>
      <Text {...textStyles}>rUSD</Text>
      <Text {...textStyles}>/</Text>
      <Text {...textStyles} variant="number" bg={gradients.blue} bgClip="text">
        {formatEther(collateral)}
      </Text>
      <Text {...textStyles}>MU</Text>
    </Box>
  )
}
