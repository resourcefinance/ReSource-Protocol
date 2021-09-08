import { useToast } from "@chakra-ui/react"

export const useTxToast = () => useToast({ isClosable: true, position: "top-right" })
