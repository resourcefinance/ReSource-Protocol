import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantLedger(props: Dict) {
  return {
    container: {
      borderRadius: "2xl",
      bgColor: "purple.main",
      color: mode(`white`, `gray.900`)(props),
    },
  }
}

const variants = {
  ledger: variantLedger,
}

export default {
  variants,
}
