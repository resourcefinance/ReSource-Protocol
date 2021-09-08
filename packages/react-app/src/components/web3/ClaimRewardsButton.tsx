import { Button } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Business } from "../../generated/resource-network/graphql"
import { useUnderwriteManagerContract } from "../../services/web3/contracts"
import { useTxToast } from "../../utils/useTxToast"

export interface ClaimRewardsButtonProps {
  businesses: Business[]
}

const ClaimRewardsButton = ({ businesses }: ClaimRewardsButtonProps) => {
  const { claimReward } = useUnderwriteManagerContract()
  const toast = useTxToast()
  let underwritees: string[] = new Array(businesses.length)
  for (let business of businesses) {
    if (!business.wallet?.multiSigAddress) return
    underwritees.push(business.wallet?.multiSigAddress)
  }

  const handleClaimRewards = async () => {
    try {
      if (underwritees.length > 0) await claimReward({ underwritees })
    } catch (e) {
      if (e.code === 4001) {
        toast({ description: "Transaction rejected", status: "error" })
      } else {
        console.log(e)
      }
    }
  }

  return (
    <Button
      leftIcon={<FontAwesomeIcon icon={faCoins} />}
      onClick={async () => await handleClaimRewards()}
    >
      Claim rewards
    </Button>
  )
}

export default ClaimRewardsButton
