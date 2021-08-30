import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, Center, Container, Text, useToast } from "@chakra-ui/react"
import { faCheckCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useApprove, useListenForApproval } from "../../services/web3/mutuality"

export interface ApproveMuProps {
  isApproved: boolean
  setIsApproved: (value: boolean) => void
}

const ApproveMuButton = ({ isApproved, setIsApproved }: ApproveMuProps) => {
  const listenForApproval = useListenForApproval()
  const approve = useApprove()
  const toast = useToast()

  const handleApprove = async () => {
    try {
      await approve()
      await listenForApproval(setIsApproved)
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
      isDisabled={isApproved}
      leftIcon={<FontAwesomeIcon icon={isApproved ? faCheckCircle : faThumbsUp} />}
      onClick={async () => await handleApprove()}
    >
      {isApproved ? "Approved" : "Approve"}
    </Button>
  )
}

export default ApproveMuButton
