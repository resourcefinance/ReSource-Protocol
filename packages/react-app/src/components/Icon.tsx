import { BoxProps } from "@chakra-ui/layout"
import { Box } from "@chakra-ui/react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import colors from "../theme/foundations/colors"

interface Props extends BoxProps {
  color?: string
  icon: IconProp
}

const Icon = ({ icon, color, ...rest }: Props) => {
  return (
    <Box {...rest}>
      <FontAwesomeIcon icon={icon} color={color ?? colors.gray[500]} />
    </Box>
  )
}

export default Icon
