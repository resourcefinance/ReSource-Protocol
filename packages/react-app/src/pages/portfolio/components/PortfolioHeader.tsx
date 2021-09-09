import { StackProps } from "@chakra-ui/layout"
import { Box, BoxProps, Flex, Heading, HStack } from "@chakra-ui/react"
import React from "react"
import GlyphLabel from "../../../components/glyph/GlyphLabel"
import { headerHeight } from "../../../components/Header"
import ClaimRewardsButton from "./ClaimRewardsButton"

export const PortfolioHeader = () => {
  return (
    <Flex {...containerStyles}>
      <Heading size="subtitle">My Portfolio</Heading>
      <HStack justify="flex-end" align="center">
        <OutstandingRewards {...outstandingRewardsStyles} />
        <ClaimRewardsButton businesses={[]} />
      </HStack>
    </Flex>
  )
}
const OutstandingRewards = ({ ...rest }: BoxProps) => {
  return (
    <Box {...rest}>
      <GlyphLabel loading={false} lineHeight="0" size="sm" variant="gradient" value={0} />
    </Box>
  )
}

const outstandingRewardsStyles: BoxProps = {
  bgColor: "white",
  borderRadius: "2xl",
  border: "1px solid",
  py: "5px",
  px: 4,
}

const containerStyles: StackProps = {
  px: { base: 4, md: 6 },
  py: { base: 2, md: 3 },
  justify: "space-between",
  alignItems: "center",
  borderBottom: "solid 1px",
  borderColor: "gray.300",
  bgColor: "white !important",
  height: "60px",
  position: "fixed",
  w: "100vw",
  top: headerHeight,
  zIndex: 1,
}

export default PortfolioHeader
