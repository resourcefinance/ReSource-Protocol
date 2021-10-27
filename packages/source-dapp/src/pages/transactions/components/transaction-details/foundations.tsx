import { Box, BoxProps, HStack, Link, Stack, StackProps, Text, TextProps } from "@chakra-ui/react"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import GlyphLabel, { GlyphLabelProps } from "../../../../components/glyph/RusdGlyphLabel"
import config from "../../../../config"
import { Transaction } from "../../../../generated/resource-network/graphql"
import { transactionStatusPropsMap } from "../transaction-table/TransactionStatusCell"

export const label: TextProps = {
  variant: "caption",
  color: "gray.700",
}

export const value: TextProps = {
  variant: "caption",
  color: "black",
}

export const cardStyles: BoxProps = {
  border: "1px solid",
  borderRadius: "2xl",
  borderColor: "primary.main",
  padding: 2,
  w: "full",
  maxW: 500,
}

export const labelMap = {
  received: {
    title: "Received",
    direction: "Received",
    counterparty: "From",
    color: "green",
  },
  sent: {
    title: "Sent",
    direction: "Total cost",
    counterparty: "Sent to",
    color: "black",
  },
  purchase: {
    title: "Purchase",
    direction: "Spent",
    counterparty: "From",
    color: "black",
  },
  sale: {
    title: "Sale",
    direction: "Received",
    counterparty: "Purchased By",
    color: "green",
  },
}

export const Block = ({ children }: BoxProps) => {
  return (
    <Box borderTop="1px solid" borderColor="primary.soft" py={2}>
      {children}
    </Box>
  )
}

export const LineItem = ({ children, ...rest }: StackProps) => {
  return (
    <Stack direction="row" align="center" justify="space-between" px={4} py={2} {...rest}>
      {children}
    </Stack>
  )
}

export const Amount = ({ value, ...rest }: GlyphLabelProps) => {
  return <GlyphLabel value={value} {...rest} />
}

type StatusItemProps = { transaction: Transaction }
export const TransactionStatusLineItem = ({ transaction }: StatusItemProps) => {
  if (!transaction?.status) return null
  const { color, icon } = transactionStatusPropsMap[transaction.status]
  return (
    <LineItem>
      <Text {...label}>Transaction Status</Text>
      <HStack>
        <Text color={color} variant="caption">
          {transaction.status.toLowerCase()}
        </Text>
        <FontAwesomeIcon size="sm" color={color} icon={icon} />
      </HStack>
    </LineItem>
  )
}

export const TransactionIdLineItem = ({ transaction }: { transaction: Transaction }) => {
  if (!transaction?.txHash) return null
  return (
    <LineItem>
      <Text {...label}>Transaction ID</Text>
      <HStack align="center">
        <Text variant="caption" noOfLines={1}>
          {getAbbreviatedHash(transaction.txHash)}
        </Text>
        <Link
          color="blue.main"
          target="_blank"
          href={config.NETWORK_EXPLORER_URL + `/tx/${transaction.txHash}`}
        >
          <HStack align="center">
            <Text variant="caption" noOfLines={1}>
              View on Explorer
            </Text>
            <Box pb={1}>
              <FontAwesomeIcon size="xs" color="" icon={faExternalLinkAlt} />
            </Box>
          </HStack>
        </Link>
      </HStack>
    </LineItem>
  )
}

export const getAbbreviatedHash = (hash?: string) => {
  if (!hash) return ""
  if (hash.length < 10) return hash
  return `${hash.substr(0, 5)}...${hash.substr(hash.length - 4)}`
}
