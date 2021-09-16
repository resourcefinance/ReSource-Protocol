import { RefetchQueriesInclude, useApolloClient } from "@apollo/client"
import { atom, useSetRecoilState } from "recoil"
import { delay } from "./delay"

interface RefetchOptions {
  delay?: number
}

interface RefetchDataProps {
  queryNames: RefetchQueriesInclude
  contractNames: string[]
  options: RefetchOptions
}

export const useRefetchData = () => {
  const refetchQueries = useRefetchQueries()
  const refetchContractCalls = useRefetchContractCalls()

  return ({ queryNames, contractNames, options }: RefetchDataProps) => {
    refetchQueries(queryNames, options)
    refetchContractCalls(contractNames, options)
  }
}

export const useRefetchQueries = () => {
  const client = useApolloClient()

  return async (queryNames: RefetchQueriesInclude, options?: RefetchOptions) => {
    if (options?.delay) await delay(options.delay)
    client.refetchQueries({ include: queryNames || "active" })
  }
}

export const refetchContractsAtom = atom({
  key: "refetchContractsAtom",
  default: [] as string[],
})

export const useRefetchContractCalls = () => {
  const setContractsToRefetch = useSetRecoilState(refetchContractsAtom)

  return async (contractsToRefetch: string[], options?: RefetchOptions) => {
    if (options?.delay) await delay(options.delay)
    setContractsToRefetch(contractsToRefetch)
  }
}
