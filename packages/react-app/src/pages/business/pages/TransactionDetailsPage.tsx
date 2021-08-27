import React from "react"
import { Box, BoxProps } from "@chakra-ui/layout"

interface Props extends BoxProps {
  key: string
}

const TransactionDetailsPage = ({ ...rest }: Props) => {
  return (
    <Box {...rest}>
      <p>TransactionDetailsPage works!</p>
    </Box>
  )
}

export default TransactionDetailsPage
