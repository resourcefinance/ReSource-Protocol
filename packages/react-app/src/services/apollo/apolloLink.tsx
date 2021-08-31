import { ApolloLink, HttpLink } from "@apollo/client"
import { useState } from "react"
// import { sentryErrorLink } from "../sentry"

const networEndpoint = "http://localhost/graphql"
const subgraphEndpoint = "http://localhost:8000/subgraphs/name/mu-dapp/graphql"
const networkLink = new HttpLink({ uri: networEndpoint })
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
