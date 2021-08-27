import { BoxProps, HStack, Text } from "@chakra-ui/layout"
import { Flex } from "@chakra-ui/react"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import colors from "../theme/foundations/colors"

const Footer = ({ ...rest }: BoxProps) => {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(10)
  const [label, setLabel] = useState("")

  useEffect(() => {
    setLabel(`${timeSinceUpdate} seconds since last update`) // seconds, minutes, hours?
  }, [timeSinceUpdate])

  return (
    <Flex {...footerStyles} {...rest}>
      <HStack>
        <Text>ReSource Network</Text>
        <Text color="gray.500">MU dApp</Text>
      </HStack>
      <HStack>
        <Text color="gray.500">({label})</Text>
        <Text>Live</Text>
        <FontAwesomeIcon icon={faCircle} color={colors.green.main} />
      </HStack>
    </Flex>
  )
}

export const footerHeight = "40px"

const footerStyles: BoxProps = {
  px: { base: 4, md: 6 },
  py: { base: 2, md: 3 },
  justifyContent: "space-between",
  borderTop: "solid 1px",
  borderColor: "blue.main",
  bgColor: "white !important",
  height: footerHeight,
  bottom: 0,
  position: "fixed",
  w: "full",
}

export default Footer
