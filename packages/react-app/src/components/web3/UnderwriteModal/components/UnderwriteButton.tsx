import { Button, ButtonProps } from "@chakra-ui/react"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { CONTRACTS } from "../../../../constants"
import {
  useMututalityTokenContract,
  useUnderwriteManagerContract,
} from "../../../../services/web3/contracts"
import { waitForTxEvent } from "../../../../services/web3/utils/waitForTxEvent"
import { useFetchBalance } from "../../../../store/wallet"
import { useTxToast } from "../../../../utils/useTxToast"
import { MIN_CREDIT_LINE, useIsApprovedState } from "../utils"

export interface StakeMuButtonProps extends ButtonProps {
  formik: any
  underwritee: string
}

const UnderwriteButton = (props: StakeMuButtonProps) => {
  const { formik, underwritee, onClick, ...rest } = props
  const { credit, collateral } = formik.values
  const [insufficientAllowance, setInsufficientAllowance] = useState(true)
  const insufficientCreditLine = credit < MIN_CREDIT_LINE
  const { underwrite } = useUnderwriteManagerContract()
  const { allowance } = useMututalityTokenContract()
  const [isApproved] = useIsApprovedState()
  const fetchBalance = useFetchBalance()
  const toast = useTxToast()

  useEffect(() => {
    allowance().then((res) => setInsufficientAllowance(false))
  }, [])

  const handleStake = async () => {
    try {
      const tx = await underwrite({
        collateralAmount: ethers.utils.parseEther(collateral.toString()).toString(),
        networkTokenAddress: CONTRACTS.RUSDToken,
        underwritee,
      })
      const confirmed = await waitForTxEvent(tx, "NewCreditLine")
      if (confirmed) {
        toast({ description: "Approved", status: "success" })
        fetchBalance()
      }
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
      colorScheme="blue"
      isDisabled={!isApproved || insufficientCreditLine || insufficientAllowance}
      leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
      onClick={async (e) => {
        await handleStake()
        onClick?.(e)
      }}
      {...rest}
    >
      {insufficientCreditLine ? "Insufficient credit line" : "Stake MU"}
    </Button>
  )
}

export default UnderwriteButton
