import { useDisclosure } from "@chakra-ui/hooks"
import { Box, BoxProps, HStack, Text } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { Tooltip } from "@chakra-ui/tooltip"
import React from "react"
import { Business } from "../../../../generated/resource-network/graphql"
import ExtendCreditModal from "../../../business/modals/ExtendCreditModal"
import { mockBusiness } from "../../mocks/tableData"

interface Props extends BoxProps {
  value: Business
}

export const ActionsHeader = () => {
  return (
    <Box pr={5}>
      <Text>actions</Text>
    </Box>
  )
}

export const ActionsCell = ({ value, ...rest }: Props) => {
  const disclosure = useDisclosure()

  if (!value?.id) return null

  return (
    <>
      <HStack justify="flex-end" {...rest} pr={4}>
        <Tooltip label="Staked SOURCE can only be withdrawn every 6 months" shouldWrapChildren>
          <Button size="xs" colorScheme="blue" variant="outline" isDisabled>
            Withdraw
          </Button>
        </Tooltip>
        <Button size="xs" colorScheme="blue" onClick={disclosure.onOpen}>
          Extend credit
        </Button>
      </HStack>
      {disclosure.isOpen && <ExtendCreditModal business={value} {...disclosure} />}
    </>
  )
}
