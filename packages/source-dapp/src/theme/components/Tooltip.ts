import { body as bodyTextStyles } from "../textStyles"

const Tooltip = {
  baseStyle: {
    w: "171px",
    color: "black",
    borderRadius: "2xl",
    bgColor: "white",
    shadow: "lg",
    padding: "16px",
    ...bodyTextStyles,
  },
  sizes: {},
  variants: {},
  defaultProps: {
    size: "",
    variant: "",
  },
}

export default Tooltip
