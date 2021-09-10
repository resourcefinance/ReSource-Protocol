import { Button, ButtonProps } from "@chakra-ui/react"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { CONTRACTS } from "../../../../constants"
import { parseRPCError } from "../../../../services/errors/rpcErrors"
import {
  useMututalityTokenContract,
  useUnderwriteManagerContract,
} from "../../../../services/web3/contracts"
import { waitForTxEvent } from "../../../../services/web3/utils/waitForTxEvent"
import { useFetchWallet } from "../../../../store/wallet"
import { useTxToast } from "../../../../utils/useTxToast"
import { MIN_CREDIT_LINE, useIsApprovedState } from "../utils"

export interface StakeMuButtonProps extends ButtonProps {
  formik: any
  underwritee: string
  extendCredit?: boolean
}

const UnderwriteButton = (props: StakeMuButtonProps) => {
  const { formik, underwritee, onClick, extendCredit, ...rest } = props
  const { credit, collateral } = formik.values
  const [insufficientAllowance, setInsufficientAllowance] = useState(true)
  const insufficientCreditLine = !extendCredit && credit < MIN_CREDIT_LINE
  const { underwrite } = useUnderwriteManagerContract()
  const { allowance } = useMututalityTokenContract()
  const [isApproved] = useIsApprovedState()
  const fetchWallet = useFetchWallet()
  const toast = useTxToast()

  useEffect(() => {
    allowance().then((res) => setInsufficientAllowance(false))
  }, [])

  const handleStake = async (event) => {
    try {
      const tx = await underwrite({
        collateralAmount: ethers.utils.parseEther(collateral.toString()).toString(),
        networkTokenAddress: CONTRACTS.RUSDToken,
        underwritee,
      })
      const confirmed = await waitForTxEvent(tx, "NewCreditLine")
      if (confirmed) {
        toast({ description: "Approved", status: "success" })
        fetchWallet()
        onClick?.(event)
      }
    } catch (error) {
      toast({ status: "error", description: parseRPCError(error) })
    }
  }

  return (
    <Button
      colorScheme="blue"
      isDisabled={!isApproved || insufficientCreditLine || insufficientAllowance}
      leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
      onClick={async (event) => handleStake(event)}
      {...rest}
    >
      {insufficientCreditLine ? "Insufficient credit line" : "Stake MU"}
    </Button>
  )
}

export default UnderwriteButton
