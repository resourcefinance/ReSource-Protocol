import { Box, BoxProps, Text } from "@chakra-ui/layout"
import { Avatar, Flex, HStack } from "@chakra-ui/react"
import React from "react"
import { Business } from "../../../generated/resource-network/graphql"
import colors from "../../../theme/foundations/colors"
import { getArrayOfEmptyObjects } from "../mocks/tableData"
import { tableDrawerWidth, tableHeaderHeight, tableRowHeight } from "./table/constants"

interface Props extends BoxProps {
  businesses: Business[]
}

const BusinessNamesDrawer = ({ businesses, ...rest }: Props) => {
  return (
    <>
      <Box
        w={tableDrawerWidth}
        {...rest}
        pos="absolute"
        bgColor="white"
        h="100%"
        borderRight={`1px solid ${colors.blue.main}`}
      >
        <Flex h={tableHeaderHeight} align="center" px={4}>
          <Text color="gray.700">business</Text>
        </Flex>
        {[...businesses, ...backfill(businesses)].map((business, index) => {
          const bgColor = index % 2 === 0 ? "gray.100" : "white"
          return (
            <HStack
              key={index}
              align="center"
              h={tableRowHeight}
              spacing={2}
              bgColor={bgColor}
              px={4}
            >
              {business.logoUrl && <Avatar boxSize="22px" src={business.logoUrl ?? ""} />}
              <Text>{business.name}</Text>
            </HStack>
          )
        })}
      </Box>
      <Box
        w="5px"
        h="100%"
        left="200px"
        pos="absolute"
        opacity={0.3}
        background="#699DFF"
        box-shadow="4px 0px 6px #699DFF"
      ></Box>
    </>
  )
}

// this function returns a bunch of "empty" businesses so that the drawer is filled with
// rows that maintain alternating background colors
function backfill(businesses: Business[]) {
  return getArrayOfEmptyObjects(29) as Business[]
}

export default BusinessNamesDrawer
