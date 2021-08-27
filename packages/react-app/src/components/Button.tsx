import { Button as ChakraButton, ButtonProps, chakra } from "@chakra-ui/react"
import React from "react"
import { buttonTextStyles } from "../theme/components/Button"

const Button = ({ children, ...props }: ButtonProps) => {
  const textStyles = buttonTextStyles(props.colorScheme)[props.variant ?? "primary"]

  return (
    <ChakraButton role="group" {...props}>
      <chakra.span _groupHover={textStyles}>{children}</chakra.span>
    </ChakraButton>
  )
}

export default Button
