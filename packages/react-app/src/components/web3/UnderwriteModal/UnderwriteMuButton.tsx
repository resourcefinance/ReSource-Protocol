import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, useToast } from "@chakra-ui/react"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useUnderwrite } from "../../services/web3/underwriteManager"

export interface StakeMuButtonProps {
  networkTokenAddress: string
  collateralAmount: string
  underwritee: string
  isApproved: boolean
}

const UnderwriteMuButton = ({
  isApproved,
  collateralAmount,
  underwritee,
  networkTokenAddress,
}: StakeMuButtonProps) => {
  const underwrite = useUnderwrite()
  const toast = useToast()

  const handleStake = async () => {
    try {
      await underwrite({ collateralAmount, underwritee, networkTokenAddress })
      // await listenForApproval(setIsApproved)
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
      isDisabled={!isApproved}
      leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
      onClick={async () => await handleStake()}
    >
      Stake MU
    </Button>
  )
}

export default UnderwriteMuButton
