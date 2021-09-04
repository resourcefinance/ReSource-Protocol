import { StackProps, Text } from "@chakra-ui/layout"
import { Box, BoxProps, Button, Flex, Heading, HStack, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { headerHeight } from "../../../components/Header"
import { ViewStorefrontButton } from "../../../components/ViewStorefrontButton"
import ExtendCreditModal from "../../../components/web3/UnderwriteModal/ExtendCreditModal"
import UnderwriteModal from "../../../components/web3/UnderwriteModal/UnderwriteModal"
import { Business } from "../../../generated/resource-network/graphql"
import { gradients } from "../../../theme/foundations/colors"
import { useQueryBusinessViaHandleInUrl } from "../utils/hooks"

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

export const BusinessHeader = () => {
  const { data } = useQueryBusinessViaHandleInUrl()
  const business = data?.findOneBusinessByHandle as Business

  return (
    <Flex {...containerStyles}>
      <HStack w="300px" spacing={4}>
        <Heading size="subtitle">{business?.name}</Heading>
        <ViewStorefrontButton handle={business?.handle ?? ""} />
      </HStack>
      <ToggleButton />
      <Flex w="300px" justify="flex-end">
        <UnderwriteModalContainer business={business} />
      </Flex>
    </Flex>
  )
}

interface ModalContainerProps extends BoxProps {
  business?: Business | null
}
const UnderwriteModalContainer = ({ business, ...props }: ModalContainerProps) => {
  const underwriteModal = useDisclosure()
  if (!business) return null
  return (
    <Box>
      <Button variant="primary" colorScheme="blue" onClick={underwriteModal.onOpen}>
        Underwrite
      </Button>
      {/* <UnderwriteModal
        isOpen={underwriteModal.isOpen}
        onClose={underwriteModal.onClose}
        business={business}
      /> */}
      <ExtendCreditModal
        isOpen={underwriteModal.isOpen}
        onClose={underwriteModal.onClose}
        business={business}
      />
    </Box>
  )
}

const toggleStyles = (active: boolean) => {
  return {
    py: 4,
    px: 5,
    h: "25px",
    _hover: {},
    _active: { shadow: "inner", fontWeight: "bold" },
    border: "none",
    variant: "ghost",
    bg: active ? gradients.blue : "",
    color: active ? "white" : "gray.main",
  }
}

const ToggleButton = () => {
  const location = useLocation()
  const { handle } = useParams<{ handle: string }>()
  const isOnSummaryPage = location.pathname.includes("summary")
  const summaryPath = `/businesses/${handle}/summary`
  const transactionsPath = `/businesses/${handle}/transactions`

  return (
    <HStack spacing="-4px" border="1px solid" borderColor="gray.500" borderRadius="full">
      <Button as={Link} to={summaryPath} {...toggleStyles(isOnSummaryPage)}>
        <Text>summary</Text>
      </Button>
      <Button as={Link} to={transactionsPath} {...toggleStyles(!isOnSummaryPage)}>
        <Text>transactions</Text>
      </Button>
    </HStack>
  )
}

export default BusinessHeader
