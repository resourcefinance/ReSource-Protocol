import { Center, Flex, HStack, StackProps } from "@chakra-ui/layout"
import { Image, ImageProps, useDisclosure } from "@chakra-ui/react"
import { faAdjust, faChartPie, faStore } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useWeb3Context } from "web3-react"
import logo from "../assets/mu.svg"
import Button from "./Button"
import WalletInfo from "./wallet/WalletInfo"
import WalletModal from "./wallet/WalletModal"

export const headerHeight = "52px"

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

export const Header = () => {
  const isConnected = false
  const history = useHistory()
  const context = useWeb3Context()
  const walletModal = useDisclosure()

  useEffect(() => {
    console.log(context)
    if (!context.active) {
      history.push("/")
      walletModal.onOpen()
    }
  }, [context])

  return (
    <Flex {...containerStyles}>
      <MuLogo />
      <HStack align="center" spacing={6}>
        <Center w="120px">
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => history.push("/")}
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
      <WalletModal isOpen={walletModal.isOpen} onClose={walletModal.onClose} />
    </Flex>
  )
}

const MuLogo = (props: ImageProps) => {
  const history = useHistory()
  return (
    <Image src={logo} _hover={{ cursor: "pointer" }} onClick={() => history.push("/")} {...props} />
  )
}

export default Header
