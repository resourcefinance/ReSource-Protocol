import { Box, BoxProps } from "@chakra-ui/layout"
import { Center, HStack, Tooltip } from "@chakra-ui/react"
import React from "react"
import { useGetUnderwriterWalletInfoQuery } from "../../generated/subgraph/graphql"
import { useGetMyWalletAddress } from "../../services/web3/utils/useGetMyWalletAddress"
import colors from "../../theme/foundations/colors"
import { useManagedCountUp } from "../../utils/useManagedCountUp"
import { GlyphLabel } from "../glyph/SourceGlyphLabel"

const BALANCE_REF = "BALANCE_REF"
const COLLATERAL_REF = "COLLATERAL_REF"

const WalletInfo = ({ ...rest }: BoxProps) => {
  const { balance, totalCollateral } = useGetWalletValues()

  useManagedCountUp({ ref: BALANCE_REF, end: balance / 1e18 })
  useManagedCountUp({ ref: COLLATERAL_REF, end: totalCollateral / 1e18 })

  return (
    <Box {...rest}>
      <HStack spacing={-14}>
        <Tooltip label="Staked SOURCE" shouldWrapChildren>
          <Center {...pillContainerStyles} pr="60px" left={0} borderColor={colors.blue.main}>
            <GlyphLabel id={COLLATERAL_REF} color={colors.blue.main} mx={1} />
          </Center>
        </Tooltip>
        <Tooltip label="SOURCE balance" shouldWrapChildren>
          <Center {...pillContainerStyles} right={0} borderColor="black">
            <GlyphLabel id={BALANCE_REF} mx={1} />
          </Center>
        </Tooltip>
      </HStack>
    </Box>
  )
}

export const useGetWalletValues = () => {
  const addr = useGetMyWalletAddress()
  const { data } = useGetUnderwriterWalletInfoQuery({ variables: { id: addr ?? "" }, skip: !addr })
  const { totalCollateral = 1000, balance = 0 } = data?.underwriter ?? {}
  return { balance, totalCollateral }
}

const pillContainerStyles: BoxProps = {
  bgColor: "white",
  borderRadius: "2xl",
  border: "1px solid",
  py: 1,
  px: 2,
}

export default React.memo(WalletInfo)
