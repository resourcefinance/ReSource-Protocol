type Options = { startLength: number }
export const getAbbreviatedAddress = (address?: string, options?: Options) => {
  if (!address) return ""
  if (address.length < 10) return address
  const length = options?.startLength ?? 5
  return `${address.substr(0, length)}...${address.substr(address.length - 4)}`
}
