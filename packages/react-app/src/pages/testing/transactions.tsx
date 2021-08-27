import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, Center, Container, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useCheckApproved, useApprove } from "../../services/ledger/mutuality"

const TestTransactionPage = () => {
  const checkApproved = useCheckApproved()
  const [isApproved, setIsApproved] = useState(false)
  const approve = useApprove()

  useEffect(() => {
    const check = async () => {
      const test = await checkApproved()
      console.log(test)
      setIsApproved(test)
    }
    check()
  }, [])

  return (
    <Container>
      <Center h="100vh">
        <VStack justify="space-between" h="450px" w="400px">
          <Button onClick={approve}>Approve</Button>
          <Text>{isApproved ? "Approved" : "Not Approved"}</Text>
        </VStack>
      </Center>
    </Container>
  )
}

export default TestTransactionPage
