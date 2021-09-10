interface RPCError {
  code: number
  message: string
  data?: {
    code: number
    message: string
  }
}

interface ParseRPCErrorOptions {
  skipUnknownErrors?: boolean
}

export const parseRPCError = (error: RPCError, options?: ParseRPCErrorOptions) => {
  console.log(error)
  if (error.code === 4001) return getTransactionRejectedMessage(error)
  if (error.code === -32603) return getInternalErrorMessage(error)
  return options?.skipUnknownErrors ? "" : getUnknownErrorMessage()
}

const getTransactionRejectedMessage = (error: RPCError) => {
  return "Transaction rejected"
}

// sample error:
// "Error: VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
const REVERTED_WITH_REASON_TEXT = `Error: VM Exception while processing transaction: reverted with reason string '`

const getInternalErrorMessage = (error: RPCError) => {
  const internalMessage = error?.data?.message
  if (internalMessage?.includes(REVERTED_WITH_REASON_TEXT)) {
    return internalMessage.substr(REVERTED_WITH_REASON_TEXT.length).slice(0, -1)
  }
  return getUnknownErrorMessage()
}

const getUnknownErrorMessage = () => {
  return "An unknown error occurred"
}
