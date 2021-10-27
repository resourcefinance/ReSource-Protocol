import { Avatar, BoxProps, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react"
import { faMapPin } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import defaultImage from "../../../assets/images/placeholder-1.jpg"
import CloudinaryImage from "../../../components/CloudinaryImage"
import { Business } from "../../../generated/resource-network/graphql"

interface BusinessCardProps {
  business: Business
}

export const cardStyles: BoxProps = {
  bgColor: "white",
  overflow: "hidden",
  flexDir: "column",
  borderRadius: "lg",
  shadow: "md",
  h: "320px",
  w: "256px",
  _hover: {
    shadow: "lg",
  },
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  if (!business.id) return null

  return (
    <Link to={`/businesses/${business.handle}/summary`}>
      <Flex {...cardStyles}>
        <CloudinaryImage
          quality={20}
          h="120px"
          w="full"
          src={business.coverUrl ?? ""}
          objectFit="cover"
        />
        <Flex justify="center" mt={-8}>
          <Avatar
            size="lg"
            src={business.logoUrl || defaultImage}
            alt="Author"
            css={{ border: "2px solid white" }}
          />
        </Flex>
        <Stack align="center" my={2} mx={4}>
          <Heading noOfLines={2} size="subheader" textAlign="center">
            {business.name}
          </Heading>
          <Text noOfLines={3} textAlign="center" color="gray.600">
            {business.tagline}
          </Text>
        </Stack>
        <HStack justify="center" mt="auto !important" m={4}>
          <FontAwesomeIcon size="sm" color="gray" icon={faMapPin} />
          <Text noOfLines={1} variant="caption" color="gray.500">
            {business.address}
          </Text>
        </HStack>
      </Flex>
    </Link>
  )
}
