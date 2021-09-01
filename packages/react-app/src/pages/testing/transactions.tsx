import { VStack } from "@chakra-ui/layout"
import { Button, Center, Container, useDisclosure } from "@chakra-ui/react"
import React from "react"
import UnderwriteModal from "../../components/web3/UnderwriteModal/UnderwriteModal"
import { Business } from "../../generated/graphql"

const TestTransactionPage = () => {
  const underwriteModal = useDisclosure()

  const business = {
    handle: "testing",
    id: "123",
    name: "testing",
    ownerId: "123123",
    wallet: {
      id: "123123",
      businessId: "testing",
      multiSigAddress: "0x7A900e4b37D5635Ccec6Ab8751f5Feb652b6bc8d",
      isActive: true,
    },
  } as Business

  return (
    <Container>
      <Center h="100vh">
        <VStack justify="space-between" h="450px" w="400px">
          <Button onClick={underwriteModal.onOpen}>Open Modal</Button>
          <UnderwriteModal
            isOpen={underwriteModal.isOpen}
            onClose={underwriteModal.onClose}
            business={business}
          />
        </VStack>
      </Center>
    </Container>
  )
}

export default TestTransactionPage
