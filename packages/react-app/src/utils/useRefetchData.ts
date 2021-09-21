import { RefetchQueriesInclude, useApolloClient, WatchQueryFetchPolicy } from "@apollo/client"
import { atom, useSetRecoilState } from "recoil"
import { delay } from "./delay"

interface RefetchOptions {
  delay?: number
}

interface RefetchDataProps {
  queryNames?: RefetchQueriesInclude
  contractNames?: string[]
  options: RefetchOptions
}

export const useRefetchData = () => {
  const refetchQueries = useRefetchQueries()
  const refetchContractCalls = useRefetchContractCalls()

  return async ({ queryNames, contractNames, options }: RefetchDataProps) => {
    return Promise.all([
      await refetchQueries(queryNames, options),
      await refetchContractCalls(contractNames, options),
    ])
  }
}

export const refetchQueriesAtom = atom({
  key: "refetchQueriesAtom",
  default: {} as Record<string, WatchQueryFetchPolicy>,
})

export const useRefetchQueries = () => {
  const client = useApolloClient()

  return async (queryNames?: RefetchQueriesInclude, options?: RefetchOptions) => {
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

  return async (contractsToRefetch?: string[], options?: RefetchOptions) => {
    if (!contractsToRefetch) return
    if (options?.delay) await delay(options.delay)
    setContractsToRefetch(contractsToRefetch)
  }
}
