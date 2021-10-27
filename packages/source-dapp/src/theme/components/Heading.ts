import { header, subheader, subtitle, title } from "../textStyles"

const baseStyle = {
  fontFamily: "heading",
  fontWeight: "bold",
}

const sizes = {
  title,
  subtitle,
  header,
  subheader,
}

const defaultProps = {
  size: title,
}

export default {
  baseStyle,
  sizes,
  defaultProps,
}
