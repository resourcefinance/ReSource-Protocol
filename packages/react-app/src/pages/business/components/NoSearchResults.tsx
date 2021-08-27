import { Heading, Image, VStack } from "@chakra-ui/react"
import NothingFound from "../../../assets/images/nothing-found.png"

export const NoSearchResults = () => {
  return (
    <VStack>
      <Image src={NothingFound} alt="Nothing found" />
      <Heading size="title">No results found</Heading>
      <Heading mt={4} size="header" color="gray.700">
        There are no results based on your search.
      </Heading>
    </VStack>
  )
}
