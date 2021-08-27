import { BoxProps, StackProps, Text } from "@chakra-ui/layout"
import { Box, HStack, VStack } from "@chakra-ui/react"
import React from "react"
import { Business } from "../../../generated/graphql"
import colors from "../../../theme/foundations/colors"

interface Props extends BoxProps {
  key: string
}

const BusinessSummaryPage = ({ ...rest }: Props) => {
  const business = {} as Business
  return (
    <Box p={6} pt="150px">
      <HStack align="flex-start" spacing="32px">
        <VStack {...columnProps}>
          <Text px={3}>Contacts</Text>
          <SolidCard label="email" value={business.email ?? "testuser@aol.com"} />
          <SolidCard label="phone" value={business.email ?? "testuser@aol.com"} />
          <SolidCard label="date joined" value={business.email ?? "testuser@aol.com"} />
          <SolidCard label="ambassador" value={business.email ?? "testuser@aol.com"} />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Market</Text>
          <OutlineCard label="sector" value={business.email ?? "testuser@aol.com"} />
          <OutlineCard label="region" value={business.email ?? "testuser@aol.com"} />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Activity</Text>
          <OutlineCard label="transaction volume" value={business.email ?? "testuser@aol.com"} />
          <OutlineCard label="transations" value={business.email ?? "testuser@aol.com"} />
          <OutlineCard label="listings" value={business.email ?? "testuser@aol.com"} />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Wallet</Text>
          <OutlineCard label="balance" value={business.email ?? "testuser@aol.com"} />
          <OutlineCard label="credit line" value={business.email ?? "testuser@aol.com"} />
        </VStack>
      </HStack>
    </Box>
  )
}

interface CardProps extends BoxProps {
  label: string
  value: string
}

const columnProps: StackProps = {
  spacing: "16px",
  align: "flex-start",
}

const SolidCard = ({ label, value, ...rest }: CardProps) => {
  return (
    <Box p={4} borderRadius="2xl" bgColor="gray.100">
      <Text color="gray.700">{label}</Text>
      <Text mt={1}>{value}</Text>
    </Box>
  )
}

const OutlineCard = ({ label, value, ...rest }: CardProps) => {
  return (
    <Box p={4} borderRadius="2xl" border={`1px solid ${colors.gray[100]}`}>
      <Text color="gray.700">{label}</Text>
      <Text mt={1}>{value}</Text>
    </Box>
  )
}

export default BusinessSummaryPage
