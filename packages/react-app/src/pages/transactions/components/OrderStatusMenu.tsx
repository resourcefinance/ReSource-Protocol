import { Box, HStack, MenuProps, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { Order } from "../../../generated/graphql"
import { orderStatusPropsMap } from "./transaction-table/OrderCell"

interface Props extends Omit<MenuProps, "children"> {
  order: Order
  readOnly?: boolean
}

export const OrderStatusMenu = ({ order, ...rest }: Props) => {
  const [statusProps] = useState(orderStatusPropsMap[order.status])

  return (
    <Box w="full" maxW="150px" as={Box}>
      <HStack justify="flex-end" fontSize="14px" pl={1}>
        <Text
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          variant="caption"
          color={statusProps.color}
          textAlign="right"
        >
          {statusProps.label ?? order.status.toLocaleLowerCase()}
        </Text>
        <FontAwesomeIcon {...statusProps} />
      </HStack>
    </Box>
  )
}
