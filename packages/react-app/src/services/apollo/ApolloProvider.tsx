import {
  ApolloClient,
  ApolloProvider as Provider,
  DefaultOptions,
  InMemoryCache,
  split,
} from "@apollo/client"
import React from "react"
import { subgraphLink, useGetNetworkLink } from "./apolloLink"

const defaultOptions: DefaultOptions = {
  query: {
    // fetchPolicy: "no-cache",
    // errorPolicy: "all",
  },
}

export const cache: InMemoryCache = new InMemoryCache({})

const ApolloProvider = (props) => {
  const networkLink = useGetNetworkLink()
  const client = new ApolloClient({
    cache,
    defaultOptions,
    connectToDevTools: true,
    link: split(
      (operation) => operation.getContext().clientName === "subgraph",
      subgraphLink,
      networkLink,
    ),
  })

  return <Provider client={client}>{props.children}</Provider>
}

export default ApolloProvider
