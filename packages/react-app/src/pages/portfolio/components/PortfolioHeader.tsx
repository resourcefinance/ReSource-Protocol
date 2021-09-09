import { Box, StackProps } from "@chakra-ui/layout"
import { BoxProps, Flex, Heading, HStack } from "@chakra-ui/react"
import React, { useState } from "react"
import { GlyphLabel } from "../../../components/glyph/MuGlyphLabel"
import { headerHeight } from "../../../components/Header"
import colors from "../../../theme/foundations/colors"
import ClaimRewardsButton from "./ClaimRewardsButton"

export const PortfolioHeader = () => {
  const [rewards, setRewards] = useState(0)
  return (
    <Flex {...containerStyles}>
      <Heading size="subtitle">My Portfolio</Heading>
      <HStack justify="flex-end" align="center">
        <OutstandingRewards {...outstandingRewardsStyles} value={rewards} />
        <ClaimRewardsButton onClick={() => setRewards((v) => v + 10)} businesses={[]} />
      </HStack>
    </Flex>
  )
}

type Props = BoxProps & { value: number }
const OutstandingRewards = ({ value, ...rest }: Props) => {
  return (
    <Box {...outstandingRewardsStyles}>
      <GlyphLabel color={colors.blue.main} value={value} />
    </Box>
  )
}

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
  borderColor: "gray.300",
  bgColor: "white !important",
  height: "60px",
  position: "fixed",
  w: "100vw",
  top: headerHeight,
  zIndex: 1,
}

export default PortfolioHeader
