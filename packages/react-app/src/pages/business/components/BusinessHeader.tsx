import { StackProps, Text } from "@chakra-ui/layout"
import { Button, Flex, Heading, HStack } from "@chakra-ui/react"
import React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { headerHeight } from "../../../components/Header"
import { ViewStorefrontButton } from "../../../components/ViewStorefrontButton"
import { Business } from "../../../generated/resource-network/graphql"
import { gradients } from "../../../theme/foundations/colors"
import { ellipsesOnOverflow } from "../../../theme/utils/text"
import { useQueryBusinessViaHandleInUrl } from "../utils/hooks"
import { UnderwriteModalContainer } from "./UnderwriteModalContainer"

export const BusinessHeader = () => {
  const { data } = useQueryBusinessViaHandleInUrl()
  const business = data?.findOneBusinessByHandle as Business

  return (
    <Flex {...containerStyles}>
      <HStack w="25%" spacing={4}>
        <Heading {...ellipsesOnOverflow} size="subtitle">
          {business?.name}
        </Heading>
        <ViewStorefrontButton handle={business?.handle ?? ""} />
      </HStack>
      <ToggleButton />
      <Flex w="25%" justify="flex-end">
        <UnderwriteModalContainer business={business} />
      </Flex>
    </Flex>
  )
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

export default BusinessHeader
