import { Box, StackProps } from "@chakra-ui/layout"
import { BoxProps, Flex, Heading, HStack } from "@chakra-ui/react"
import React from "react"
import { GlyphLabel } from "../../../components/glyph/SourceGlyphLabel"
import { headerHeight } from "../../../components/Header"
import {
  CreditLineFieldsFragment,
  useGetUnderwriterQuery,
} from "../../../generated/subgraph/graphql"
import { useGetMyWalletAddress } from "../../../services/web3/utils/useGetMyWalletAddress"
import colors from "../../../theme/foundations/colors"
import { useManagedCountUp } from "../../../utils/useManagedCountUp"
import ClaimRewardsButton from "./ClaimRewardsButton"

const REWARDS_REF = "REWARDS_REF"

export const PortfolioHeader = () => {
  const address = useGetMyWalletAddress()
  const { data } = useGetUnderwriterQuery({ variables: { id: address ?? "" }, skip: !address })
  const rewards = data?.underwriter?.totalRewards ?? 0
  const creditLines = (data?.underwriter?.creditLines ?? []) as CreditLineFieldsFragment[]

  return (
    <Flex {...containerStyles}>
      <Heading size="subtitle">My Portfolio</Heading>
      <HStack justify="flex-end" align="center" spacing={5}>
        <OutstandingRewards {...outstandingRewardsStyles} value={rewards} />
        <ClaimRewardsButton creditLines={creditLines} value={rewards} />
      </HStack>
    </Flex>
  )
}

type Props = BoxProps & { value: number }
const OutstandingRewards = ({ value, ...rest }: Props) => {
  useManagedCountUp({ ref: REWARDS_REF, end: value / 1e18 })

  return (
    <Box {...outstandingRewardsStyles}>
      <GlyphLabel id={REWARDS_REF} color={colors.blue.main} />
    </Box>
  )
}

export const portfolioHeaderHeight = 59

const outstandingRewardsStyles: BoxProps = {
  border: `1px solid ${colors.blue.main}`,
  borderRadius: "2xl",
  py: "6px",
  px: 4,
}

const containerStyles: StackProps = {
  px: { base: 4, md: 6 },
  py: { base: 2, md: 3 },
  justify: "space-between",
  alignItems: "center",
  borderBottom: "solid 1px",
  borderColor: "blue.main",
  bgColor: "white !important",
  height: portfolioHeaderHeight,
  position: "fixed",
  w: "100vw",
  top: headerHeight,
  zIndex: 1,
}

export default PortfolioHeader
