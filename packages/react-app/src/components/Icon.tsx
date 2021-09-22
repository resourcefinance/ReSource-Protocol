import { BoxProps } from "@chakra-ui/layout"
import { Box } from "@chakra-ui/react"
import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import colors from "../theme/foundations/colors"

interface Props extends BoxProps {
  color?: string
  icon: IconProp
  size?: SizeProp
}

const Icon = ({ icon, size, color, ...rest }: Props) => {
  return (
    <Box {...rest}>
      <FontAwesomeIcon size={size} icon={icon} color={color ?? colors.gray[500]} />
    </Box>
  )
}

export default Icon
