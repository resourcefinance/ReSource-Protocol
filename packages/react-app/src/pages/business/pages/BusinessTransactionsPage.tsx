import {Text} from "@chakra-ui/layout"
import {Box, BoxProps} from "@chakra-ui/layout"
import React from "react"

interface Props extends BoxProps {
  key: string
}

const BusinessTransactionsPage = ({...rest}: Props) => {
  return (
    <Box {...rest}>
      <Text>Business transaction page</Text>
    </Box>
  )
}

export default BusinessTransactionsPage
