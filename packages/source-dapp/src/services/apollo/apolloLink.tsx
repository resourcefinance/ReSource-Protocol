import { ApolloLink, HttpLink } from "@apollo/client"
import { useState } from "react"
import { config } from "../../config"

const networkEndpoint = config.RESOURCE_NETWORK_URL
const subgraphEndpoint = config.SUBGRAPH_URL
const networkLink = new HttpLink({ uri: networkEndpoint })
export const subgraphLink = new HttpLink({ uri: subgraphEndpoint })

const getApolloLink = (token?: string) =>
  new ApolloLink((operation, forward) => {
    operation.setContext({ headers: { Authorization: token ? `Bearer ${token}` : "" } })
    return forward(operation)
  })

export const useGetNetworkLink = () => {
  const [middlewareLink] = useState(getApolloLink())
  const httpLinkAuth = middlewareLink.concat(networkLink)
  return ApolloLink.from([httpLinkAuth])
}
