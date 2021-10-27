import { useToast, UseToastOptions } from "@chakra-ui/react"

export const useTxToast = () =>
  useToast({
    variant: "solid",
    isClosable: true,
    position: "top-right",
  })
