import { BoxProps, VStack } from "@chakra-ui/layout"
import { Button, Center, Container, Text, useToast } from "@chakra-ui/react"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useCheckApproved, useApprove, useListenForApproval } from "../../services/web3/mutuality"

const ApproveMuButton = () => {
  const checkApproved = useCheckApproved()
  const listenForApproval = useListenForApproval()
  const [isApproved, setIsApproved] = useState(false)
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

  useEffect(() => {
    const check = async () => {
      try {
        const approved = await checkApproved()
        setIsApproved(approved)
      } catch (e) {
        console.log(e)
        setIsApproved(false)
      }
    }
    check()
  }, [])

  return (
    <Button
      isDisabled={isApproved}
      leftIcon={<FontAwesomeIcon icon={faThumbsUp} />}
      onClick={async () => await handleApprove()}
    >
      Approve
    </Button>
  )
}

export default ApproveMuButton
