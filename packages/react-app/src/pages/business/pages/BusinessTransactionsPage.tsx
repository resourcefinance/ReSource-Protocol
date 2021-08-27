import { BoxProps, Text } from "@chakra-ui/layout"
import { Center } from "@chakra-ui/react"
import React from "react"

const BusinessTransactionsPage = ({ ...rest }: BoxProps) => {
  return (
    <Center pt="150px" h="full" w="full" {...rest}>
      <Text>Business transaction page</Text>
    </Center>
  )
}

export default BusinessTransactionsPage
