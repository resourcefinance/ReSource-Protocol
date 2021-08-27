import { ApolloLink, HttpLink } from "@apollo/client"
import { useState } from "react"
// import { sentryErrorLink } from "../sentry"

const httpEndpoint = "http://localhost/graphql"
const httpLink = new HttpLink({ uri: httpEndpoint })

const getApolloLink = (token?: string) =>
  new ApolloLink((operation, forward) => {
    operation.setContext({ headers: { Authorization: token ? `Bearer ${token}` : "" } })
    return forward(operation)
  })

export const useGetLink = () => {
  const [middlewareLink, setMiddlewareLink] = useState(getApolloLink())
  const httpLinkAuth = middlewareLink.concat(httpLink)
  return ApolloLink.from([/*sentryErrorLink*/ httpLinkAuth])
}
