import { VStack } from "@chakra-ui/layout"
import { Center, Container } from "@chakra-ui/react"
import React from "react"
import {
  Business,
  useFindBusinessByHandleLazyQuery,
} from "../../../generated/resource-network/graphql"
import { BusinessCard } from "../components/BusinessCard"
import BusinessSearchBar from "../components/BusinessSearchBar"
import { NoSearchResults } from "../components/NoSearchResults"

const SearchBusinessesPage = () => {
  const [find, { data, called, loading }] = useFindBusinessByHandleLazyQuery()
  const business = data?.findOneBusinessByHandle as Business

  const handleSearch = (searchText: string) => find({ variables: { handle: searchText } })

  return (
    <Container>
      <Center h="100vh">
        <VStack justify="space-between" h="450px" w="400px">
          <BusinessSearchBar onSearch={handleSearch} />
          {business && <BusinessCard business={business} />}
          {called && !loading && !business && <NoSearchResults />}
        </VStack>
      </Center>
    </Container>
  )
}

export default SearchBusinessesPage
