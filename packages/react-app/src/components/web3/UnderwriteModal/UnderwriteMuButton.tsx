import { Button, ButtonProps, useToast } from "@chakra-ui/react"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { CONTRACTS } from "../../../constants"
import {
  useMututalityTokenContract,
  useUnderwriteManagerContract,
} from "../../../services/web3/contracts"
import { useIsApprovedState, useRevertApproval } from "./utils"

const MIN_CREDIT_LINE = 500

export interface StakeMuButtonProps extends ButtonProps {
  collateralAmount: number
  creditLineAmount: number
  underwritee: string
}

const UnderwriteMuButton = (props: StakeMuButtonProps) => {
  const { collateralAmount, creditLineAmount, underwritee, ...rest } = props
  const [insufficientAllowance, setInsufficientAllowance] = useState(true)
  const insufficientCreditLine = creditLineAmount < MIN_CREDIT_LINE
  const { underwrite } = useUnderwriteManagerContract()
  const { allowance } = useMututalityTokenContract()
  const revertApproval = useRevertApproval()
  const isApproved = useIsApprovedState()
  const toast = useToast()

  useEffect(() => {
    allowance().then((res) => {
      console.log("UnderwriteMuButton.tsx --  res", res)
      setInsufficientAllowance(false)
    })
  }, [])

  const handleStake = async () => {
    try {
      console.log("UnderwriteMuButton.tsx --  collateralAmount", collateralAmount)
      console.log("UnderwriteMuButton.tsx --  underwritee", underwritee)
      // await revertApproval()
      // await underwrite({ collateralAmount, underwritee, networkTokenAddress: CONTRACTS.RUSDToken })
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
      colorScheme="blue"
      isDisabled={!isApproved || insufficientCreditLine || insufficientAllowance}
      leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
      onClick={async () => await handleStake()}
      {...rest}
    >
      {insufficientCreditLine ? "Insufficient credit line" : "Stake MU"}
    </Button>
  )
}

export default UnderwriteMuButton
