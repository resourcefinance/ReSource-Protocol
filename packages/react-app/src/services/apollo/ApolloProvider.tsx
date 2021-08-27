import { ApolloClient, ApolloProvider as Provider, InMemoryCache } from "@apollo/client"
import React from "react"
import { useGetLink } from "./apolloLink"

export const cache: InMemoryCache = new InMemoryCache({})

const ApolloProvider = (props) => {
  const link = useGetLink()
  const client = new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
  })

  return <Provider client={client}>{props.children}</Provider>
}

export default ApolloProvider
