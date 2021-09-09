import { Button, ButtonProps, useToast } from "@chakra-ui/react"
import { faCheckCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import config from "../../../../config"
import { useMututalityTokenContract } from "../../../../services/web3/contracts"
import { waitForTxEvent } from "../../../../services/web3/utils/waitForTxEvent"
import { useTxToast } from "../../../../utils/useTxToast"
import { useIsApprovedState, useRevertApproval } from "../utils"

const isDev = config.NODE_ENV === "development" // temporary... or convenience for testing in future?

const ApproveMuButton = (props: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useIsApprovedState()
  const toast = useTxToast()
  const { approve } = useMututalityTokenContract()
  const revertApproval = useRevertApproval()

  const handleApprove = async () => {
    try {
      setIsLoading(true)
      const tx = await approve()
      const confirmed = await waitForTxEvent(tx, "Approval")
      if (confirmed) {
        toast({ description: "Approved", status: "success" })
        setIsApproved(true)
      }
    } catch (e) {
      if (e.code === 4001) {
        toast({ description: "Transaction rejected", status: "error" })
      } else {
        console.log(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      colorScheme="blue"
      variant="secondary"
      isLoading={isLoading}
      isDisabled={isApproved && !isDev}
      leftIcon={<FontAwesomeIcon icon={isApproved ? faCheckCircle : faThumbsUp} />}
      onClick={async () => (isApproved && isDev ? revertApproval() : handleApprove())}
      {...props}
    >
      {isApproved ? "Revert Approval" : "Approve"}
    </Button>
  )
}

export default ApproveMuButton
