import { Box, BoxProps } from "@chakra-ui/layout"
import React, { useCallback } from "react"
import { footerHeight } from "../../../components/Footer"
import {
  Business,
  useFindBusinessesForPortfolioQuery,
} from "../../../generated/resource-network/graphql"
import {
  CreditLineFieldsFragment,
  useGetCreditLinesQuery,
} from "../../../generated/subgraph/graphql"
import { useGetMyWalletAddress } from "../../../services/web3/utils/useGetMyWalletAddress"
import BusinessNamesDrawer from "../components/BusinessNamesDrawer"
import CreditLinesTable from "../components/table/CreditLinesTable"

const PortfolioPage = () => {
  const { data, loading, called } = useGetData()

  if (loading) return null

  return (
    <Box {...containerStyles}>
      <BusinessNamesDrawer businesses={data.map((d) => d.business)} />
      <CreditLinesTable creditLines={data} />
    </Box>
  )
}

const useGetData = () => {
  const myAddress = useGetMyWalletAddress()
  const { creditLines, creditLinesLoading, creditLinesCalled } = useGetCreditLines(myAddress)
  const { businesses, businessesLoading, businessesCalled } = useGetBusinesses(creditLines)

  return {
    data: useCombineData(creditLines, businesses),
    loading: creditLinesLoading || businessesLoading,
    called: creditLinesCalled && businessesCalled,
  }
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
  const query = useFindBusinessesForPortfolioQuery({
    variables: { where: { wallet: { multiSigAddress: { in: underwritees } } } },
    skip: !underwritees.length,
  })

  return {
    // businesses: getMockBusinesses(),
    businesses: (query.data?.findManyBusiness?.businesses ?? []) as Business[],
    businessesLoading: query.loading,
    businessesCalled: query.called,
    ...query,
  }
}

function useCombineData(creditLines: CreditLineFieldsFragment[], businesses: Business[]) {
  const findBusiness = useCallback(
    (cl: CreditLineFieldsFragment) =>
      businesses.find((biz) => biz?.wallet?.multiSigAddress === cl.underwritee) ?? ({} as Business),
    [businesses],
  )

  return creditLines.map((cl) => ({ ...cl, business: findBusiness(cl) }))
}

const containerStyles: BoxProps = {
  mt: "110px",
  mb: footerHeight,
  position: "relative",
}

export default PortfolioPage
