import { Center, Flex, HStack, StackProps } from "@chakra-ui/layout"
import { faChartPie, faStore } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useWeb3Context } from "web3-react"
import Button from "./Button"
import { RusdGlyphGradient } from "./glyph/MuGlyph"
import AddressInfo from "./wallet/AddressInfo"
import WalletInfo from "./wallet/WalletInfo"

export const Header = () => {
  const history = useHistory()
  const location = useLocation()
  const context = useWeb3Context()

  return (
    <Flex {...containerStyles}>
      <RusdGlyphGradient
        boxSize="36px"
        onClick={() => history.push("/")}
        _hover={{ cursor: "pointer" }}
      />
      <HStack align="center" spacing={6}>
        <Center w="120px">
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => history.push("/")}
            isActive={!location.pathname.includes("/portfolio")}
            leftIcon={<FontAwesomeIcon icon={faStore} />}
          >
            Businesses
          </Button>
        </Center>
        <Center w="130px" pr={2}>
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => history.push("/portfolio")}
            isActive={location.pathname.includes("/portfolio")}
            leftIcon={<FontAwesomeIcon icon={faChartPie} />}
          >
            Portfolio
          </Button>
        </Center>
        {context.library && (
          <>
            <WalletInfo />
            <AddressInfo />
          </>
        )}
      </HStack>
    </Flex>
  )
}

export const headerHeight = 51

const containerStyles: StackProps = {
  px: { base: 4, md: 6 },
  py: { base: 2, md: 3 },
  justify: "space-between",
  alignItems: "center",
  borderBottom: "solid 1px",
  borderColor: "gray.300",
  bgColor: "white !important",
  height: headerHeight,
  position: "fixed",
  w: "100vw",
  zIndex: 1,
}

export default Header
