import { VStack } from "@chakra-ui/layout"
import { Box, Center, Container, Spinner } from "@chakra-ui/react"
import React from "react"
import {
  Business,
  useFindFirstBusinessLazyQuery,
} from "../../../generated/resource-network/graphql"
import { BusinessCard } from "../components/BusinessCard"
import BusinessSearchBar from "../components/BusinessSearchBar"
import { NoSearchResults } from "../components/NoSearchResults"

const SearchBusinessesPage = () => {
  const [find, { data, called, loading }] = useFindFirstBusinessLazyQuery({
    fetchPolicy: "network-only",
  })
  const business = data?.findFirstBusiness as Business

  const handleSearch = (text: string) => {
    find({ variables: { where: { handle: { equals: text }, isDisabled: { equals: false } } } })
  }

  return (
    <Container>
      <Center h="100vh">
        <VStack justify="space-between" h="450px" w="400px">
          <BusinessSearchBar onSearch={handleSearch} />
          {!loading && business && <BusinessCard business={business} />}
          {loading && (
            <Box h="250px">
              <Spinner color="blue.main" />
            </Box>
          )}
          <NoSearchResults display={called && !loading && !business ? "initial" : "none"} />
        </VStack>
      </Center>
    </Container>
  )
}

export default SearchBusinessesPage
