import { Box, BoxProps } from "@chakra-ui/layout"
import React from "react"
import { footerHeight } from "../../../components/Footer"
import { Business, useFindManyBusinessQuery } from "../../../generated/resource-network/graphql"
import {
  CreditLineFieldsFragment,
  useGetCreditLinesQuery,
} from "../../../generated/subgraph/graphql"
import { useGetMyWalletAddress } from "../../../services/web3/utils/useGetMyWalletAddress"
import BusinessNamesDrawer from "../components/BusinessNamesDrawer"
import CreditLinesTable from "../components/table/CreditLinesTable"
import { getMockBusinesses, getMockCreditLines } from "../mocks/tableData"

const PortfolioPage = () => {
  const myAddress = useGetMyWalletAddress()
  const { creditLines, creditLinesLoading, creditLinesCalled } = useGetCreditLines(myAddress)
  const { businesses, businessesLoading, businessesCalled } = useGetBusinesses(creditLines)

  if (businessesLoading || creditLinesLoading) return null

  return (
    <Box {...containerStyles}>
      <BusinessNamesDrawer businesses={businesses} />
      <CreditLinesTable creditLines={creditLines} />
    </Box>
  )
}

const useGetCreditLines = (underwriterAddress?: string) => {
  const query = useGetCreditLinesQuery({
    variables: { where: { underwriter: underwriterAddress } },
    skip: !underwriterAddress,
  })

  return {
    // creditLines: getMockCreditLines(),
    creditLines: query.data?.creditLines ?? [],
    creditLinesLoading: query.loading,
    creditLinesCalled: query.called,
    ...query,
  }
}

const useGetBusinesses = (creditLines: CreditLineFieldsFragment[]) => {
  const underwritees = creditLines.map((creditLine) => creditLine.underwritee)
  const query = useFindManyBusinessQuery({
    variables: { where: { wallet: { multiSigAddress: { in: underwritees } } } },
  })

  return {
    // businesses: getMockBusinesses(),
    businesses: (query.data?.findManyBusiness?.businesses ?? []) as Business[],
    businessesLoading: query.loading,
    businessesCalled: query.called,
    ...query,
  }
}

const containerStyles: BoxProps = {
  mt: "110px",
  mb: footerHeight,
  position: "relative",
}

export default PortfolioPage
