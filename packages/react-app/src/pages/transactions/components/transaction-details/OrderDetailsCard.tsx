import { Box, BoxProps, HStack, Text } from "@chakra-ui/layout"
import { Avatar } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import { GlyphColor } from "../../../../components/glyph/RusdGlyph"
import {
  Business,
  Listing,
  Order,
  Transaction,
} from "../../../../generated/resource-network/graphql"
import { localizedDayJs } from "../../../../utils/dayjs"
import { OrderStatusMenu } from "../OrderStatusMenu"
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

interface OrderTransaction extends Transaction {
  order: Order // explicitly force order no not be null for TS support
}

const OrderDetailsCard = ({ transaction, myWalletId, ...rest }: Props) => {
  const { type } = getType(transaction, myWalletId)
  const { amount, createdAt, sender, recipient, order } = transaction as OrderTransaction
  const business =
    (type === "purchase" ? recipient?.business : sender?.business) ?? ({} as Business)
  const { handle, logoUrl, id: businessId } = business as Business

  const { listing, quantity, note } = order
  const { title, cost } = listing ?? ({} as Listing)

  if (!(type === "sale") && !(type === "purchase")) return null

  return (
    <Box {...cardStyles} {...rest}>
      <HStack justify="flex-start" spacing={3} p={4} pt={3}>
        <FontAwesomeIcon icon={transactionTypeIconMap[type]} />
        <Text variant="body">{labelMap[type].title}</Text>
      </HStack>
      <Block>
        <LineItem>
          <Text {...label}>Item</Text>
          <Text {...value}>{title}</Text>
        </LineItem>
        <LineItem>
          <Text {...label}>Quantity</Text>
          <Text {...value}>{quantity}</Text>
        </LineItem>
        <LineItem>
          <Text {...label}>Price per unit</Text>
          <Amount value={cost} />
        </LineItem>
      </Block>
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
          <Text {...label}>Order Status</Text>
          <OrderStatusMenu readOnly={type !== "sale"} order={order}></OrderStatusMenu>
        </LineItem>
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

export default OrderDetailsCard
