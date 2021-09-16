import { HStack, Text } from "@chakra-ui/layout"
import React from "react"

type Data = { value: number; label: "rUSD" | "MU" }

export const TableCell = ({ value: _value }: { value: Data }) => {
  const { value, label } = _value ?? {}

  if (!value) return null

  return (
    <HStack justify="flex-end">
      <Text variant="number">{value}</Text>
      <Text variant="caption" color="gray.700" fontSize="10px">
        {label}
      </Text>
    </HStack>
  )
}
