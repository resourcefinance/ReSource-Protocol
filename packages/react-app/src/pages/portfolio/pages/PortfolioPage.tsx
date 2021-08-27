import React from "react"
import { Box, BoxProps } from "@chakra-ui/layout"

interface Props extends BoxProps {
  key: string
}

const PortfolioPage = ({ ...rest }: Props) => {
  return (
    <Box {...rest}>
      <p>PortfolioPage works!</p>
    </Box>
  )
}

export default PortfolioPage
