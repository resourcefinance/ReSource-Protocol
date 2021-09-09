import { Box, BoxProps, Text, TextProps } from "@chakra-ui/react"
import React from "react"
import { Business } from "../../../../generated/resource-network/graphql"
import { gradients } from "../../../../theme/foundations/colors"

const textStyles: TextProps = { as: "span", mx: 1 }

interface Props extends BoxProps {
  business: Business
  formik?: any
}

export const CurrentUnderwriteMetrics = ({ business }: Props) => {
  return (
    <Box as="span">
      <Text {...textStyles}>Credit line currently underwritten</Text>
      <LeverageRatio collateral={0} credit={0} />
    </Box>
  )
}

interface Props extends BoxProps {
  business: Business
  formik?: any
}

export const ProspectiveMetrics = ({ business }: Props) => {
  return (
    <Box as="span">
      <Text {...textStyles}>New total credit line</Text>
      <LeverageRatio collateral={0} credit={0} />
    </Box>
  )
}

interface LeverageRatioProps extends BoxProps {
  collateral: number
  credit: number
}

const LeverageRatio = ({ collateral, credit }: LeverageRatioProps) => {
  return (
    <Box as="span">
      <Text {...textStyles} variant="number" bg={gradients.primary} bgClip="text">
        {credit}
      </Text>
      <Text {...textStyles} variant="caption">
        rUSD
      </Text>
      <Text {...textStyles} variant="caption">
        /
      </Text>
      <Text {...textStyles} variant="number" bg={gradients.blue} bgClip="text">
        {collateral}
      </Text>
      <Text {...textStyles} variant="caption">
        MU
      </Text>
    </Box>
  )
}
