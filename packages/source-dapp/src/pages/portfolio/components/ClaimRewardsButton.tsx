import { Button, ButtonProps } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { CreditLineFieldsFragment } from "../../../generated/subgraph/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { waitForTxEvent } from "../../../services/web3/utils/waitForTxEvent"
import { useRefetchData } from "../../../utils/useRefetchData"
import { useTxToast } from "../../../utils/useTxToast"

export interface ClaimRewardsButtonProps extends ButtonProps {
  creditLines: CreditLineFieldsFragment[]
  value: number
}

const ClaimRewardsButton = ({ value, creditLines, ...rest }: ClaimRewardsButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useTxToast()
  const refetch = useRefetchData()
  const underwritees = creditLines
    .map((creditLine) => creditLine.underwritee)
    .filter((underwritee) => !!underwritee)
  const { claimReward } = useUnderwriteManagerContract()

  const handleClaimRewards = async () => {
    try {
      setIsLoading(true)
      const tx = await claimReward({ underwritees })
      const confirmed = await waitForTxEvent(tx, "CreditLineRewardClaimed")
      if (confirmed) {
        await refetch({
          queryNames: "active",
          contractNames: ["balanceOf"],
          options: { delay: 2000 },
        })
        toast({ description: "Rewards claimed!", status: "success" })
      }
    } catch (error) {
      toast({ status: "error", description: parseRPCError(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      maxH="37px"
      isLoading={isLoading}
      isDisabled={!(value > 0)}
      colorScheme="blue"
      leftIcon={<FontAwesomeIcon icon={faCoins} />}
      onClick={async () => await handleClaimRewards()}
    >
      Claim rewards
    </Button>
  )
}

export default ClaimRewardsButton
