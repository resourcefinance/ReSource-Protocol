import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, Center, Container, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import ApproveMuButton from "../../components/web3/ApproveMuButton"

import { useCheckApproved, useApprove } from "../../services/web3/mutuality"

const TestTransactionPage = () => {
  return (
    <Container>
      <Center h="100vh">
        <VStack justify="space-between" h="450px" w="400px">
          <ApproveMuButton />
        </VStack>
      </Center>
    </Container>
  )
}

export default TestTransactionPage
