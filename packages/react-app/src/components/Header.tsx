import { Center, Flex, HStack, StackProps } from "@chakra-ui/layout"
import { Image, ImageProps } from "@chakra-ui/react"
import { faChartPie, faStore } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useHistory } from "react-router-dom"
import logo from "../assets/mu.svg"
// import AccountBalanceInfo from "../../services/ledger/components/WalletInfo"
import Button from "./Button"
import WalletInfo from "./WalletInfo"

export const headerHeight = "52px"
export const footerHeight = "52px"

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
  zIndex: 11, // this should go back down to 1 once chat styling is cleaned up
}

export const Header = () => {
  const isConnected = false
  const history = useHistory()

  return (
    <Flex {...containerStyles}>
      <MuLogo />
      <HStack align="center" spacing={6}>
        <Center w="120px">
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => history.push("/businesses")}
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
            leftIcon={<FontAwesomeIcon icon={faChartPie} />}
          >
            Portfolio
          </Button>
        </Center>
        <WalletInfo />
      </HStack>
    </Flex>
  )
}

const MuLogo = (props: ImageProps) => {
  const history = useHistory()
  return (
    <Image
      src={logo}
      _hover={{ cursor: "pointer" }}
      onClick={() => history.push("/businesses")}
      {...props}
    />
  )
}

export default Header
