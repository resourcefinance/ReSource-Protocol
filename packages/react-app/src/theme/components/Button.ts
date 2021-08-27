import { transparentize } from "@chakra-ui/theme-tools"
import { gradients } from "../foundations/colors"
import { body, body as bodyText, subheader, subheader as subheaderText } from "../textStyles"
import { Dict } from "../utils/types"

const baseStyle = {
  ...subheaderText,
  borderRadius: "2xl",
  transition: "all 0.05s",
}

const variantGhost = (props: Dict) => {
  const { colorScheme, theme } = props
  const transparentColor = transparentize(`${colorScheme}.main`, 0.2)(theme)

  return {
    _hover: {
      bg: transparentColor,
    },
  }
}

const variantLink = (props: Dict) => {
  const { colorScheme } = props
  const activeColor = `${colorScheme}.dark`

  return {
    ...body,
    height: "2em",
    lineHeight: "300%",
    borderRadius: 0,
    textDecoration: "none !important",
    mx: 1,
    color: "gray.main",
    _hover: {
      color: activeColor,
    },
    _focus: {
      ...subheader,
      color: activeColor,
    },
    _active: {
      ...subheader,
      color: activeColor,
      borderColor: activeColor,
      borderBottom: `1px solid`,
    },
  }
}

const variantOutline = (props: Dict) => {
  const { colorScheme, theme } = props
  const mainColor = `${colorScheme}.main`
  const activeColor = `${colorScheme}.dark`
  const transparentColor = transparentize(`${colorScheme}.main`, 0.2)(theme)

  return {
    borderWidth: "2px",
    color: mainColor,
    borderColor: transparentColor,
    _hover: {
      border: "2px solid",
      color: activeColor,
      shadow: "md",
      bg: "transparent",
      _disabled: {
        borderColor: "inherit",
      },
    },
    _active: {
      color: activeColor,
      shadow: "inner",
      bg: "transparent",
    },
  }
}

const outlineVariantText = (colorScheme: string) => {
  if (!gradients[colorScheme]) return {}
  return {
    bg: gradients[colorScheme],
    bgClip: "text",
  }
}

const variantSecondary = (props: Dict) => {
  const { colorScheme } = props
  const bgColor = `${colorScheme}.soft`
  const activeBgColor = `${colorScheme}.variantSoft`
  const mainColor = `${colorScheme}.main`
  const activeColor = `${colorScheme}.dark`

  return {
    bgColor: bgColor,
    color: mainColor,
    border: "2px solid",
    borderColor: "transparent",
    _hover: {
      color: activeColor,
      bgColor: bgColor,
      borderColor: mainColor,
      shadow: "md",
      _disabled: {
        border: "inherit",
        bg: bgColor,
      },
    },
    _active: {
      color: activeColor,
      bgColor: activeBgColor,
      shadow: "inner",
    },
  }
}

const secondaryVariantText = outlineVariantText

const variantPrimary = (props: Dict) => {
  const { colorScheme } = props
  const mainColor = `${colorScheme}.main`
  const activeColor = `${colorScheme}.dark`
  const gradient = gradients[colorScheme]

  return {
    backgroundColor: mainColor,
    color: "white",
    _hover: {
      bgGradient: gradient,
      shadow: "md",
      _disabled: {
        bgColor: mainColor,
        opacity: 0.4,
      },
    },
    _active: {
      backgroundColor: activeColor,
      color: "white",
      shadow: "inner",
    },
  }
}

const variantChip = (props: Dict) => {
  const { colorScheme } = props
  const activeBgColor = `${colorScheme}.light`

  const variantChip = {
    ...bodyText,
    borderRadius: "full",
    backgroundColor: "gray.cultured",
    color: "gray.davys",
    _hover: {
      backgroundColor: "gray.gainsboro",
      color: "black",
    },
    _active: {
      backgroundColor: activeBgColor,
      color: "white",
    },
    _disabled: {
      backgroundColor: "gray.cultured",
      color: "white",
    },
  }

  return variantChip
}

const variantMenu = (props: Dict) => {
  const variantChip = {
    ...bodyText,
    borderRadius: "2xl",
    rounded: "2xl",
    border: "1px solid",
    borderColor: "gray.300",
    _hover: {
      // backgroundColor: "gray.100",
      boxShadow: "sm",
    },
    _disabled: {
      backgroundColor: "gray.cultured",
    },
  }

  return variantChip
}

const defaultProps = {
  variant: "primary",
}

const Button = {
  baseStyle,
  variants: {
    unstyled: {},
    ghost: variantGhost,
    link: variantLink,
    outline: variantOutline,
    secondary: variantSecondary,
    primary: variantPrimary,
    solid: variantPrimary,
    chip: variantChip,
    menu: variantMenu,
  },
  defaultProps,
}

export const buttonTextStyles = (colorScheme: "secondary" | "outline") => ({
  secondary: secondaryVariantText(colorScheme),
  outline: outlineVariantText(colorScheme),
})

export default Button
