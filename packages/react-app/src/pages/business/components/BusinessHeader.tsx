import { StackProps, Text } from "@chakra-ui/layout"
import { BoxProps, Button, Flex, Heading, HStack } from "@chakra-ui/react"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { headerHeight } from "../../../components/Header"
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
  const business = data?.findOneBusinessByHandle

  return (
    <Flex {...containerStyles}>
      <HStack w="300px" spacing={4}>
        <Heading size="subtitle">{business?.name}</Heading>
        <ViewStoreFrontButton handle={business?.handle ?? ""} />
      </HStack>
      <ToggleButton />

      <Flex w="300px" justify="flex-end">
        <Button variant="primary" colorScheme="blue">
          Underwrite
        </Button>
      </Flex>
    </Flex>
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
  const active = location.pathname.includes("summary")

  return (
    <HStack spacing="-4px" border="1px solid" borderColor="gray.500" borderRadius="full">
      <Button as={Link} to="summary" {...toggleStyles(active)}>
        <Text>summary</Text>
      </Button>
      <Button as={Link} to="transactions" {...toggleStyles(!active)}>
        <Text>transactions</Text>
      </Button>
    </HStack>
  )
}

type Props = { handle: string } & BoxProps
const ViewStoreFrontButton = ({ handle, ...rest }: Props) => {
  return (
    <Button
      as={"a"}
      variant="link"
      color="blue.main"
      target="_blank"
      rel="noopener noreferrer"
      href={`https://app.resourcenetwork.co/${handle}`}
      rightIcon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
    >
      View storefront
    </Button>
  )
}

export default BusinessHeader
