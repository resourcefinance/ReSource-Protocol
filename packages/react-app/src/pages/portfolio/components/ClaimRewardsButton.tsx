import { Button, ButtonProps } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import {
  CreditLineFieldsFragment,
  useGetCreditLinesQuery,
} from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { useGetMyWalletAddress } from "../../../services/web3/utils/useGetMyWalletAddress"
import { useTxToast } from "../../../utils/useTxToast"

export interface ClaimRewardsButtonProps extends ButtonProps {
  creditLines: CreditLineFieldsFragment[]
}

const ClaimRewardsButton = ({ ...rest }: ClaimRewardsButtonProps) => {
  const myAddress = useGetMyWalletAddress()
  const { creditLines, creditLinesLoading } = useGetCreditLines(myAddress)
  const { claimReward } = useUnderwriteManagerContract()
  const underwritees = creditLines
    .map((creditLine) => creditLine.underwritee)
    .filter((underwritee) => !!underwritee)
  const toast = useTxToast()

  const handleClaimRewards = async () => {
    try {
      if (underwritees.length > 0) await claimReward({ underwritees })
    } catch (error) {
      toast({ status: "error", description: parseRPCError(error) })
    }
  }

  return (
    <Button
      maxH="37px"
      colorScheme="blue"
      leftIcon={<FontAwesomeIcon icon={faCoins} />}
      onClick={rest.onClick}
      // onClick={async () => await handleClaimRewards()}
    >
      Claim rewards
    </Button>
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

export default ClaimRewardsButton
