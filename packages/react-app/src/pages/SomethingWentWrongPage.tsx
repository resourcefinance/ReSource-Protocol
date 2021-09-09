import { Button, Container, Heading, Icon, Image, VStack } from "@chakra-ui/react"
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import errorImage from "../assets/something-went-wrong.svg"

const SomethingWentWrongPage = () => {
  return (
    <Container alignItems="center">
      <VStack justify="center" h="80vh">
        <Image src={errorImage} />
        <Heading size="title">Oops... something went wrong</Heading>
        <Button
          mt={2}
          colorScheme="primary"
          leftIcon={<Icon icon={faChevronCircleLeft} color="inherit" />}
          onClick={() => (window.location.href = "/businesses")}
        >
          Take me back
        </Button>
      </VStack>
    </Container>
  )
}

export default SomethingWentWrongPage
