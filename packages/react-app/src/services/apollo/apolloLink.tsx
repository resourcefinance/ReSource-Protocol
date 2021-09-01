import { ApolloLink, HttpLink } from "@apollo/client"
import { useState } from "react"
// import { sentryErrorLink } from "../sentry"
import { SUBGRAPH_URLS } from "../../constants"

const networkEndpoint = "http://localhost/graphql"
const subgraphEndpoint = SUBGRAPH_URLS.localhost
const networkLink = new HttpLink({ uri: networkEndpoint })
export const subgraphLink = new HttpLink({ uri: subgraphEndpoint })

const getApolloLink = (token?: string) =>
  new ApolloLink((operation, forward) => {
    operation.setContext({ headers: { Authorization: token ? `Bearer ${token}` : "" } })
    return forward(operation)
  })

export const useGetNetworkLink = () => {
  const [middlewareLink, setMiddlewareLink] = useState(getApolloLink())
  const httpLinkAuth = middlewareLink.concat(networkLink)
  return ApolloLink.from([/*sentryErrorLink*/ httpLinkAuth])
}
