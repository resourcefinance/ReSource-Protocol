import { BoxProps } from "@chakra-ui/layout"
import { generateStripe, getColor, mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const parts = ["track", "filledTrack", "label"]

function filledStyle(props: Dict) {
  const { colorScheme: c, theme: t, isIndeterminate, hasStripe } = props

  const stripeStyle = mode(generateStripe(), generateStripe("1rem", "rgba(0,0,0,0.1)"))(props)

  const bgColor = `${c}.main`

  const gradient = `linear-gradient(
    to right,
    transparent 0%,
    ${getColor(t, bgColor)} 50%,
    transparent 100%
  )`

  const addStripe = !isIndeterminate && hasStripe

  return {
    ...(addStripe && stripeStyle),
    ...(isIndeterminate ? { bgImage: gradient } : { bgColor }),
  }
}

const baseStyleLabel = {
  lineHeight: "1",
  fontSize: "0.25em",
  fontWeight: "bold",
  color: "white",
}

function baseStyleTrack(props: Dict) {
  const { colorScheme: c } = props
  return {
    borderRadius: "full",
    bg: `${c}.soft`,
  }
}

function baseStyleFilledTrack(props: Dict) {
  return {
    transition: "all 0.3s",
    ...filledStyle(props),
  }
}

const baseStyle = (props: Dict) => ({
  label: baseStyleLabel,
  filledTrack: { ...baseStyleFilledTrack(props), borderRightRadius: 0 },
  track: baseStyleTrack(props),
})

const defaultProps = {
  size: "md",
  colorScheme: "purple",
}

export default {
  parts,
  baseStyle,
  defaultProps,
}
