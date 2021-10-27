import { BoxProps, Text, VStack } from "@chakra-ui/layout"
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { faAt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useRef } from "react"

interface Props extends BoxProps {
  onSearch: (searchText: string) => void
}

const BusinessSearchBar = ({ onSearch, ...rest }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyPressed = (event) => {
    const currentValue = inputRef?.current?.value
    if (event.key === "Enter" && currentValue) onSearch(currentValue)
  }

  return (
    <VStack w="full">
      <InputGroup>
        <InputLeftElement zIndex={1} pointerEvents="none">
          <FontAwesomeIcon icon={faAt} />
        </InputLeftElement>
        <Input ref={inputRef} onKeyPress={handleKeyPressed} placeholder={`Enter business handle`} />
      </InputGroup>
      <Text alignSelf="flex-end" variant="caption" color="gray.700" px={2}>
        business handle must be exact
      </Text>
    </VStack>
  )
}

export default BusinessSearchBar
