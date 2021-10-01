import { VStack } from "@chakra-ui/layout"
import { Box, Center, Container, Spinner } from "@chakra-ui/react"
import React from "react"
import {
  Business,
  useFindBusinessByHandleLazyQuery,
} from "../../../generated/resource-network/graphql"
import { BusinessCard } from "../components/BusinessCard"
import BusinessSearchBar from "../components/BusinessSearchBar"
import { NoSearchResults } from "../components/NoSearchResults"

const SearchBusinessesPage = () => {
  const [find, { data, called, loading }] = useFindBusinessByHandleLazyQuery({
    fetchPolicy: "network-only",
  })
  const business = data?.findOneBusinessByHandle as Business

  const handleSearch = (searchText: string) => find({ variables: { handle: searchText } })

  return (
    <Container>
      <Center h="100vh">
        <VStack justify="center" mb="450px" alignItems="flex-end" h="450px" w="400px">
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
