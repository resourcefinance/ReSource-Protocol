import { BoxProps } from "@chakra-ui/layout"
import { Input, InputGroup, VStack, Text, InputLeftElement } from "@chakra-ui/react"
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
    <>
      <InputGroup>
        <InputLeftElement zIndex={1} pointerEvents="none">
          <FontAwesomeIcon icon={faAt} />
        </InputLeftElement>
        <Input ref={inputRef} onKeyPress={handleKeyPressed} placeholder={`Search businesses`} />
      </InputGroup>
      <Text>business handle must be exact</Text>
    </>
  )
}

export default BusinessSearchBar
