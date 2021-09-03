import { Button, ButtonProps, useToast } from "@chakra-ui/react"
import { faCheckCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useMututalityTokenContract } from "../../../../services/web3/contracts"
import { useIsApprovedState, useListenForApproval } from "../utils"

const ApproveMuButton = (props: ButtonProps) => {
  const isApproved = useIsApprovedState()
  const listenForApproval = useListenForApproval()
  const { approve } = useMututalityTokenContract()
  const toast = useToast()

  const handleApprove = async () => {
    try {
      await approve()
      await listenForApproval()
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
      variant="secondary"
      isDisabled={isApproved}
      leftIcon={<FontAwesomeIcon icon={isApproved ? faCheckCircle : faThumbsUp} />}
      onClick={async () => await handleApprove()}
      {...props}
    >
      {isApproved ? "Approved" : "Approve"}
    </Button>
  )
}

export default ApproveMuButton
