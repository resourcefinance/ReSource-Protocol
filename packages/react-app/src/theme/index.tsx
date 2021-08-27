import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import components from "./components"
import foundations from "./foundations"
import { styles as globalStyles } from "./styles"
import { textStyles } from "./textStyles"
import { layerStyles } from "./layerStyles"

const overrides: any = {
  ...foundations,
  components,
  styles: globalStyles,
  textStyles,
  layerStyles,
}

const resourceTheme = extendTheme(overrides)

export const ThemeProvider = (props: any) => {
  return <ChakraProvider theme={resourceTheme}>{props.children}</ChakraProvider>
}
