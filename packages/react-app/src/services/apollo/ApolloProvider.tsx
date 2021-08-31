import { ApolloClient, ApolloLink, ApolloProvider as Provider, InMemoryCache } from "@apollo/client"
import React from "react"
import { subgraphLink, useGetNetworkLink } from "./apolloLink"

export const cache: InMemoryCache = new InMemoryCache({})

const ApolloProvider = (props) => {
  const networkLink = useGetNetworkLink()
  const client = new ApolloClient({
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === "subgraph",
      subgraphLink,
      networkLink,
    ),
    cache,
    connectToDevTools: true,
  })

  return <Provider client={client}>{props.children}</Provider>
}

export default ApolloProvider
