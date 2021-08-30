import { useParams } from "react-router-dom"
import {
  useFindBusinessByHandleQuery,
  useFindTransactionByIdQuery,
} from "../../../generated/graphql"

// this hook should only be used inside BusinessRoutes, otherwise, handle will be undfined and the
// network call will not be executed
export const useQueryBusinessViaHandleInUrl = () => {
  const { handle } = useParams<{ handle: string }>()
  return useFindBusinessByHandleQuery({ variables: { handle }, skip: !handle })
}

// this hook should only be used inside BusinessRoutes, otherwise, handle will be undfined and the
// network call will not be executed
export const useQueryTransactionViaIdInUrl = () => {
  const { transactionId } = useParams<{ transactionId: string }>()
  return useFindTransactionByIdQuery({ variables: { id: transactionId } })
}
