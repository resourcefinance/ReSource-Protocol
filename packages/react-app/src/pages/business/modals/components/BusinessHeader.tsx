import { BoxProps } from "@chakra-ui/layout"
import { Avatar, Box, Heading, HStack } from "@chakra-ui/react"
import React from "react"
import { Business } from "../../../../generated/resource-network/graphql"
import { ViewStorefrontButton } from "../../../../components/ViewStorefrontButton"

interface Props extends BoxProps {
  business: Business
}

export const BusinessHeader = ({ business, ...rest }: Props) => {
  return (
    <HStack mt={3} mb={4} align="stretch" justify="flex-start">
      <Box>
        <Avatar mb={4} h="50px" w="50px" src={business.logoUrl ?? ""} />
      </Box>
      <Box>
        <Heading mx={1} size="header">
          {business.name}
        </Heading>
        <ViewStorefrontButton handle={business.handle} />
      </Box>
    </HStack>
  )
}
