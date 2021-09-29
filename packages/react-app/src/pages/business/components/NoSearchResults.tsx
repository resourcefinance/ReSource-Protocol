import { BoxProps, Heading, Image, VStack } from "@chakra-ui/react"
import NothingFound from "../../../assets/images/nothing-found.png"

export const NoSearchResults = (props: BoxProps) => {
  return (
    <VStack align="center" {...props}>
      <Image src={NothingFound} alt="Nothing found" />
      <Heading textAlign="center" size="title">
        No results found
      </Heading>
      <Heading textAlign="center" mt={4} size="header" color="gray.700">
        There are no results based on your search.
      </Heading>
    </VStack>
  )
}
