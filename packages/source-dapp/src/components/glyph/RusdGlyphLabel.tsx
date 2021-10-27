import { chakra, Text, TextProps } from "@chakra-ui/react"
import React from "react"
import colors from "../../theme/foundations/colors"
import { RusdGlyphGradient, RusdGlyphSolid } from "./RusdGlyph"
import { walletValueToString } from "./SourceGlyphLabel"

type GlyphLabelVariant = "credit" | "balance" | "price" | "gradient"

export interface GlyphLabelProps extends TextProps {
  value?: number | null | string
  badStanding?: boolean
  variant?: GlyphLabelVariant
}

const GlyphLabel = (props: GlyphLabelProps) => {
  const { id, value, badStanding, variant, ...rest } = props

  return (
    <chakra.span {...rest} whiteSpace="nowrap">
      <Label id={id} value={value} badStanding={badStanding} {...rest} />
      <Glyph {...rest} ml={1} />
    </chakra.span>
  )
}

const Glyph = (props: GlyphLabelProps) => {
  return props.color !== colors.purple.main ? (
    <RusdGlyphSolid boxSize="12px" display="initial" {...(props as any)} />
  ) : (
    <RusdGlyphGradient purple boxSize="12px" display="initial" {...(props as any)} />
  )
}

const Label = (props: GlyphLabelProps) => {
  const { value, id } = props
  const numberValue = typeof value === "string" ? parseFloat(value) : value ?? 0
  if (isNaN(numberValue)) throw new Error("could not parse Glyph value")
  const formattedValue = walletValueToString(numberValue)

  return (
    <Text id={id} as="span" variant="number" {...props}>
      {formattedValue}
    </Text>
  )
}

const getColor = (props: { value: number; badStanding?: boolean; variant?: GlyphLabelVariant }) => {
  const { value, badStanding = false, variant = "price" } = props
  if (variant === "credit") return "purple"
  if (variant === "price") return "gray"
  if (badStanding) return "red"
  if (value <= 0) return "black"
  if (value > 0) return "green"
  return "black"
}

export default GlyphLabel
