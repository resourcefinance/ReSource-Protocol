import { Button, ButtonProps } from "@chakra-ui/react"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { useMututalityTokenContract } from "../../../../services/web3/contracts"
import { parseEther } from "../../../../services/web3/utils/etherUtils"

export interface StakeMuButtonProps extends ButtonProps {
  formik: any
}

const StakeButton = (props: StakeMuButtonProps) => {
  const { formik, ...rest } = props
  const formCollateral = ethers.BigNumber.from(formik.values.collateral || 0)
  const [insufficientBalance, setInsufficientBalance] = useState(true)
  const [availableCollateral, setAvailableCollateral] = useState(ethers.BigNumber.from(0))
  const { balanceOf } = useMututalityTokenContract()

  useEffect(() => {
    balanceOf().then(setAvailableCollateral)
  }, [])

  useEffect(() => {
    const availableValue = ethers.BigNumber.from(availableCollateral || 0)
    const formValue = ethers.BigNumber.from(parseEther(formCollateral || 0))
    setInsufficientBalance(availableValue.lt(formValue))
  }, [formCollateral, availableCollateral])

  const isDisabled = props.isDisabled || formCollateral.lt(0) || insufficientBalance

  return (
    <Button
      type="submit"
      colorScheme="blue"
      {...rest}
      leftIcon={isDisabled ? undefined : <FontAwesomeIcon icon={faCheckCircle} />}
      isDisabled={isDisabled}
    >
      {insufficientBalance ? "Insufficient collateral" : "Stake"}
    </Button>
  )
}

export default StakeButton
