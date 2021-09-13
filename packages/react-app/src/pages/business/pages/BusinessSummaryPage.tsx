import { BoxProps, StackProps, Text } from "@chakra-ui/layout"
import { Box, HStack, VStack } from "@chakra-ui/react"
import React from "react"
import {
  Business,
  useBusinessTransactionStatsQuery,
  useWalletBalanceQuery,
} from "../../../generated/resource-network/graphql"
import colors from "../../../theme/foundations/colors"
import { localizedDayJs } from "../../../utils/dayjs"
import { NoSearchResults } from "../components/NoSearchResults"
import { useQueryBusinessViaHandleInUrl } from "../utils/hooks"

const BusinessSummaryPage = () => {
  const { data, called, loading } = useQueryBusinessViaHandleInUrl()
  const business = (data?.findOneBusinessByHandle as Business) ?? null
  const summaryData = useGetRelevantSummaryData(business)
  const { txVolume, txCount, listingCount, balance, creditLine } = summaryData

  if (loading) return null
  if (called && !loading && !business) return <NoSearchResults />

  return (
    <Box p={6} pt="150px">
      <HStack align="flex-start" spacing="32px">
        <VStack {...columnProps}>
          <Text px={3}>Contacts</Text>
          <SolidCard label="email" value={business.email} />
          <SolidCard label="phone" value={business.phoneNumber} />
          <SolidCard label="date joined" value={localizedDayJs(business.createdAt).format("LL")} />
          <SolidCard label="ambassador" value={business.ambassador?.handle} />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Market</Text>
          {/* <OutlineCard label="sector" value={business.email} /> */}
          <OutlineCard label="region" value={business.address} />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Activity</Text>
          <OutlineCard label="transaction volume" value={txVolume} numeric rusd />
          <OutlineCard label="transations" value={txCount} numeric />
          <OutlineCard label="listings" value={listingCount} numeric />
        </VStack>
        <VStack {...columnProps}>
          <Text px={3}>Wallet</Text>
          <OutlineCard label="balance" value={balance} numeric rusd />
          <OutlineCard label="credit line" value={creditLine} numeric rusd />
        </VStack>
      </HStack>
    </Box>
  )
}

const useGetRelevantSummaryData = (business?: Business) => {
  const businessId = business?.id ?? ""
  const walletId = business?.wallet?.id ?? ""
  const txQuery = useBusinessTransactionStatsQuery({ variables: { businessId }, skip: !businessId })
  const walletQuery = useWalletBalanceQuery({ variables: { id: walletId }, skip: !walletId })
  const { creditLimit: creditLine = 0, balance = 0 } = walletQuery.data?.walletBalance ?? {}
  const { volume = 0, count = 0 } = txQuery.data?.businessTransactionStats ?? {}
  const listingCount = business?.listings?.length ?? 0

  return { listingCount, creditLine, txVolume: volume, txCount: count, balance }
}

interface CardProps extends BoxProps {
  label?: string | null
  value?: string | number | null
  numeric?: boolean
  rusd?: boolean
}

const columnProps: StackProps = {
  spacing: "16px",
  align: "stretch",
  minW: "150px",
}

const SolidCard = ({ label, value, ...rest }: CardProps) => {
  return (
    <Box p={4} borderRadius="2xl" bgColor="gray.100">
      <Text color="gray.700">{label}</Text>
      <Text mt={1}>{value ?? "n/a"}</Text>
    </Box>
  )
}

const OutlineCard = ({ label, value, numeric, rusd, ...rest }: CardProps) => {
  return (
    <Box p={4} borderRadius="2xl" border={`1px solid ${colors.gray[100]}`}>
      <Text color="gray.700">{label}</Text>
      <Text as="span" variant={numeric ? "number" : "body"} mt={1}>
        {value ?? "n/a"}
      </Text>
      {rusd && (
        <Text mx={1} as="span" color="gray.700" variant="caption">
          rUSD
        </Text>
      )}
    </Box>
  )
}

export default BusinessSummaryPage
