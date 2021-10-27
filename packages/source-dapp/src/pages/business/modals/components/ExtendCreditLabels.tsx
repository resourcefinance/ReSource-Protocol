import { Box, BoxProps, Flex, HStack, Text, TextProps } from "@chakra-ui/react"
import { BigNumberish } from "ethers"
import React from "react"
import {
  formatEther,
  formatMwei,
  parseEther,
  parseMwei,
} from "../../../../services/web3/utils/etherUtils"
import { gradients } from "../../../../theme/foundations/colors"

interface Props extends BoxProps {
  formik?: any
  collateral: BigNumberish
  credit: BigNumberish
}

export const CurrentUnderwriteMetrics = ({ collateral, credit }: Props) => {
  return (
    <Flex px={2} alignItems="baseline" flexWrap="wrap">
      <Text mr={2}>Credit line currently underwritten:</Text>
      <LeverageRatio collateral={collateral} credit={credit} />
    </Flex>
  )
}

export const NewUnderwriteMetrics = ({ collateral, credit, formik }: Props) => {
  const newCollateral = parseEther(formik.values.collateral).add(collateral)
  const newCredit = parseMwei(formik.values.credit).add(credit)

  return (
    <Flex px={2} alignItems="baseline" flexWrap="wrap">
      <Text mr={2}>New total credit line:</Text>
      <LeverageRatio collateral={newCollateral} credit={newCredit} />
    </Flex>
  )
}

interface LeverageRatioProps extends BoxProps {
  collateral: BigNumberish
  credit: BigNumberish
}

const LeverageRatio = ({ collateral, credit }: LeverageRatioProps) => {
  return (
    <HStack pt={1}>
      <Text variant="number" bg={gradients.primary} bgClip="text">
        {formatMwei(credit)}
      </Text>
      <Text variant="caption">rUSD</Text>
      <Text variant="caption">/</Text>
      <Text variant="number" bg={gradients.blue} bgClip="text">
        {formatEther(collateral)}
      </Text>
      <Text variant="caption">MU</Text>
    </HStack>
  )
}
