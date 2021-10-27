import { Box, BoxProps, Text } from "@chakra-ui/layout"
import { Avatar, Flex, HStack } from "@chakra-ui/react"
import React from "react"
import { useHistory } from "react-router"
import { Business } from "../../../generated/resource-network/graphql"
import colors from "../../../theme/foundations/colors"
import {
  tableDrawerWidth,
  tableHeaderHeight,
  tableRowHeight,
  tableStripeColor,
  useBackfillRows,
} from "./table/utils"

interface Props extends BoxProps {
  businesses: Business[]
}

const BusinessNamesDrawer = ({ businesses, ...rest }: Props) => {
  const history = useHistory()
  const height = document.body.scrollHeight
  return (
    <>
      <Box
        w={tableDrawerWidth}
        {...rest}
        pos="absolute"
        bgColor="white"
        h={height}
        borderRight={`1px solid ${colors.blue.main}`}
      >
        <Flex h={tableHeaderHeight} align="center" px={4}>
          <Text color="gray.700">business</Text>
        </Flex>
        {[...businesses, ...useBackfillRows(businesses)].map((business, index) => {
          const bgColor = index % 2 === 0 ? tableStripeColor : "white"
          return (
            <HStack
              px={4}
              key={index}
              spacing={2}
              align="center"
              bgColor={bgColor}
              h={tableRowHeight}
              cursor={business?.id ? "pointer" : "initial"}
              onClick={() => business?.id && history.push(`/businesses/${business.handle}/summary`)}
            >
              {business.name && <Avatar boxSize="22px" src={business.logoUrl ?? ""} />}
              <Text>{business.name}</Text>
            </HStack>
          )
        })}
      </Box>
      <Box
        w="5px"
        h={height}
        left={tableDrawerWidth}
        pos="absolute"
        opacity={0.3}
        background="#699DFF"
        box-shadow="4px 0px 6px #699DFF"
      ></Box>
    </>
  )
}

export default BusinessNamesDrawer
