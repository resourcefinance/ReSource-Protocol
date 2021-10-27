import { Box, Button, Container, SkeletonText } from "@chakra-ui/react"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useHistory } from "react-router-dom"
import { Transaction } from "../../generated/resource-network/graphql"
import {
  useQueryBusinessViaHandleInUrl,
  useQueryTransactionViaIdInUrl,
} from "../business/utils/hooks"
import { cardStyles } from "./components/transaction-details/foundations"
import OrderDetailsCard from "./components/transaction-details/OrderDetailsCard"
import TransactionDetailsCard from "./components/transaction-details/TransactionDetailsCard"
import { getType } from "./components/transaction-table/TypeCell"

const TransactionDetailsPage = () => {
  const history = useHistory()
  const businessQuery = useQueryBusinessViaHandleInUrl()
  const transactionQuery = useQueryTransactionViaIdInUrl()
  const wallet = businessQuery.data?.findOneBusinessByHandle?.wallet
  const isLoading = businessQuery.loading || transactionQuery.loading
  const transaction = (transactionQuery.data?.findTransactionById ?? {}) as Transaction
  const { type } = !isLoading && wallet?.id ? getType(transaction, wallet.id) : { type: undefined }

  return (
    <Container maxW="container.xl" py="100px" my={{ base: 4, md: 12 }}>
      <Button
        ml={0}
        mt={1}
        size="sm"
        variant="link"
        onClick={() => (history as any).goBack()}
        leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
      >
        Back
      </Button>
      <Box mt={{ base: 6, md: 12 }}>
        <>
          {isLoading && (
            <Box {...cardStyles}>
              <SkeletonText p={4} noOfLines={8} spacing="6" />
            </Box>
          )}
          {(type === "sent" || type === "received") && wallet?.id && (
            <TransactionDetailsCard transaction={transaction} myWalletId={wallet?.id} />
          )}
          {(type === "purchase" || type === "sale") && wallet?.id && (
            <OrderDetailsCard transaction={transaction} myWalletId={wallet?.id} />
          )}
        </>
      </Box>
    </Container>
  )
}

export default TransactionDetailsPage
