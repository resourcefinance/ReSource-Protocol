import { Button, ButtonProps } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Business } from "../../../generated/resource-network/graphql"
import { parseRPCError } from "../../../services/errors/rpcErrors"
import { useUnderwriteManagerContract } from "../../../services/web3/contracts"
import { useTxToast } from "../../../utils/useTxToast"

export interface ClaimRewardsButtonProps extends ButtonProps {
  businesses: Business[]
}

const ClaimRewardsButton = ({ businesses, ...rest }: ClaimRewardsButtonProps) => {
  const { claimReward } = useUnderwriteManagerContract()
  const toast = useTxToast()

  let underwritees: string[] = new Array(businesses.length)
  for (let business of businesses) {
    if (!business.wallet?.multiSigAddress) return null
    underwritees.push(business.wallet?.multiSigAddress)
  }

  const handleClaimRewards = async () => {
    try {
      if (underwritees.length > 0) await claimReward({ underwritees })
    } catch (error) {
      toast({ status: "error", description: parseRPCError(error) })
    }
  }

  return (
    <Button
      colorScheme="blue"
      leftIcon={<FontAwesomeIcon icon={faCoins} />}
      onClick={rest.onClick}
      // onClick={async () => await handleClaimRewards()}
    >
      Claim rewards
    </Button>
  )
}

export default ClaimRewardsButton
