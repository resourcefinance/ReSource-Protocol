import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, Center, Container, Text, useToast } from "@chakra-ui/react"
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { Business } from "../../generated/graphql"
import { useClaimReward } from "../../services/web3/underwriteManager"

export interface ClaimRewardsButtonProps {
  businesses: Business[]
}

const ClaimRewardsButton = ({ businesses }: ClaimRewardsButtonProps) => {
  const claimRewards = useClaimReward()
  const toast = useToast()
  let underwritees: string[] = new Array(businesses.length)
  for (let business of businesses) {
    if (!business.wallet?.multiSigAddress) return
    underwritees.push(business.wallet?.multiSigAddress)
  }

  const handleClaimRewards = async () => {
    try {
      if (underwritees.length > 0) await claimRewards({ underwritees })
    } catch (e) {
      if (e.code === 4001) {
        toast({ description: "Transaction rejected", position: "top-right", status: "error" })
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
