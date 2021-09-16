import { Button, ButtonProps } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { CreditLineFieldsFragment } from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { useRefetchData } from "../../../utils/useRefetchData"
import { useTxToast } from "../../../utils/useTxToast"

export interface ClaimRewardsButtonProps extends ButtonProps {
  creditLines: CreditLineFieldsFragment[]
}

const ClaimRewardsButton = ({ creditLines, ...rest }: ClaimRewardsButtonProps) => {
  const toast = useTxToast()
  const refetch = useRefetchData()
  const underwritees = creditLines
    .map((creditLine) => creditLine.underwritee)
    .filter((underwritee) => !!underwritee)
  const { claimReward } = useUnderwriteManagerContract()

  const handleClaimRewards = async () => {
    try {
      if (underwritees.length > 0) {
        await claimReward({ underwritees })
        refetch({ queryNames: "active", contractNames: ["balanceOf"], options: { delay: 2000 } })
      }
    } catch (error) {
      toast({ status: "error", description: parseRPCError(error) })
    }
  }

  return (
    <Button
      maxH="37px"
      colorScheme="blue"
      leftIcon={<FontAwesomeIcon icon={faCoins} />}
      onClick={async () => await handleClaimRewards()}
    >
      Claim rewards
    </Button>
  )
}

export default ClaimRewardsButton
