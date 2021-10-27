import { chakra, Icon, IconProps, Image, ImageProps } from "@chakra-ui/react"
import React from "react"
import rusdGradientPurple from "../../assets/glyphs/rusd-gradient-purple.svg"
import rusdGradient from "../../assets/glyphs/rusd-gradient.svg"

interface RusdGlyphGradientProps extends ImageProps {
  purple?: boolean
}

export const RusdGlyphGradient = ({ purple, ...props }: RusdGlyphGradientProps) => {
  return <Image src={purple ? rusdGradientPurple : rusdGradient} {...props} />
}

export const RusdGlyphSolid = ({ color, ...props }: IconProps) => {
  return (
    <Icon as="image" viewBox="0 0 64 64" {...props}>
      <chakra.svg fill={color}>
        <path d="M32 0C14.3271 0 0 14.3271 0 32C0 49.6729 14.3271 64 32 64C49.6729 64 64 49.6729 64 32C64 14.3271 49.6729 0 32 0Z" />
        <path
          d="M41.6702 36.1813C41.4533 35.8124 41.5547 35.3244 41.9218 35.1031C45.1618 33.1475 46.8738 29.5617 46.8738 25.5804C46.8738 18.1368 42.0276 13.6906 33.0356 13.6906H22.1938H20.224C19.6329 13.6906 19.2596 14.327 19.5485 14.8426L22.5538 20.2142C22.6907 20.4586 22.9493 20.6106 23.2293 20.6106H26.7653H28.1991H32.1111C35.3831 20.6106 37.5067 22.6835 37.5067 25.7564C37.5067 28.8791 35.5085 30.8524 32.136 30.8524H29.8089C29.2178 30.8524 28.8453 31.4879 29.1333 32.0035L31.9893 37.1217H32.0107L37.3565 46.7386C38.9049 49.5359 39.8542 50.3111 42.0773 50.3111C44.7502 50.3111 46.6489 48.5626 46.6489 46.1395C46.6489 45.0657 46.4738 44.3164 45.6747 42.9919L41.6702 36.1813Z"
          fill="white"
        />
        <path
          d="M23.42 50.3102C25.9144 50.3102 27.9365 48.2881 27.9365 45.7937C27.9365 43.2994 25.9144 41.2773 23.42 41.2773C20.9256 41.2773 18.9036 43.2994 18.9036 45.7937C18.9036 48.2881 20.9256 50.3102 23.42 50.3102Z"
          fill="white"
        />
      </chakra.svg>
    </Icon>
  )
}
