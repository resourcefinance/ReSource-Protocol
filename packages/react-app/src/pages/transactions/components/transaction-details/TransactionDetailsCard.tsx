import { Box, BoxProps, HStack, Text } from "@chakra-ui/layout"
import { Avatar } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import { GlyphColor } from "../../../../components/glyph/RusdGlyph"
import { Business, Transaction } from "../../../../generated/resource-network/graphql"
import { localizedDayJs } from "../../../../utils/dayjs"
import { transactionTypeIconMap } from "../transaction-table/foundations"
import { getType } from "../transaction-table/TypeCell"
import {
  Amount,
  Block,
  cardStyles,
  label,
  labelMap,
  LineItem,
  TransactionIdLineItem,
  TransactionStatusLineItem,
  value,
} from "./foundations"

interface Props extends BoxProps {
  transaction: Transaction
  myWalletId: string
}

const TransactionDetailsCard = ({ transaction, myWalletId, ...rest }: Props) => {
  const { type } = getType(transaction, myWalletId)
  const { amount, note, createdAt, sender, recipient } = transaction
  const business = (type === "sent" ? recipient?.business : sender?.business) ?? ({} as Business)
  const { handle, logoUrl, id: businessId } = business

  if (!(type === "sent") && !(type === "received")) return null

  return (
    <Box {...cardStyles} {...rest}>
      <HStack justify="flex-start" spacing={3} p={4} pt={3}>
        <FontAwesomeIcon icon={transactionTypeIconMap[type]} />
        <Text variant="body">{labelMap[type].title}</Text>
      </HStack>
      <Block>
        <LineItem>
          <Text {...label} variant="body">
            {labelMap[type].direction}
          </Text>
          <Amount
            variant="credit"
            value={amount}
            size="md"
            color={labelMap[type].color as GlyphColor}
          />
        </LineItem>
      </Block>
      <Block>
        <LineItem>
          <Text {...label}>Date</Text>
          <Text variant="number" {...value} letterSpacing={2}>
            {localizedDayJs(createdAt).format("L")}
          </Text>
        </LineItem>
        <TransactionIdLineItem transaction={transaction} />
        <TransactionStatusLineItem transaction={transaction} />
      </Block>
      <Block>
        <LineItem>
          <Text {...label}>{labelMap[type].counterparty}</Text>
          <HStack>
            <Avatar mt="2px" w="20px" h="20px" src={logoUrl ?? ""} alt={"Logo"} />
            <Link to={`/${handle}`}>
              <Text noOfLines={1}>{`@${handle}`}</Text>
            </Link>
          </HStack>
        </LineItem>
        {note && (
          <LineItem direction="column" align="flex-start">
            <Text {...label}>Note</Text>
            <Text whiteSpace="pre-wrap" variant="number" {...value}>
              {note}
            </Text>
          </LineItem>
        )}
      </Block>
    </Box>
  )
}

export default TransactionDetailsCard
