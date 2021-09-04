import {
  Avatar,
  Box,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { ViewStorefrontButton } from "../../../components/ViewStorefrontButton"
import { CONTRACTS } from "../../../constants"
import { Business } from "../../../generated/resource-network/graphql"
import {
  useMututalityTokenContract,
  useUnderwriteManagerContract,
} from "../../../services/web3/contracts"
import { waitForTxEvent } from "../../../services/web3/utils/waitForTxEvent"
import { useFetchBalance } from "../../../store/wallet"
import { UnderwriteForm } from "./UnderwriteForm"
import { isApprovedSelector } from "./utils"

export interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const { underwrite } = useUnderwriteManagerContract()
  const toast = useToast()
  const fetchBalance = useFetchBalance()
  const underwritee = business.wallet?.multiSigAddress
  const setIsApproved = useSetRecoilState(isApprovedSelector)
  const { approve } = useMututalityTokenContract()
  const history = useHistory()

  if (!underwritee) return null

  const handleStake = async (collateralAmount: number) => {
    try {
      const tx = await underwrite({
        collateralAmount: ethers.utils.parseEther(collateralAmount.toString()).toString(),
        underwritee,
        networkTokenAddress: CONTRACTS.RUSDToken,
      })
      const confirmed = await waitForTxEvent(tx, "NewCreditLine")
      if (confirmed) {
        toast({
          description: "Approved",
          position: "top-right",
          status: "success",
          isClosable: true,
        })
        fetchBalance()
        onClose()
        history.push("/portfolio")
      }
    } catch (e) {
      if (e.code === 4001) {
        toast({ description: "Transaction rejected", position: "top-right", status: "error" })
      } else {
        console.log(e)
      }
    }
  }

  const handleApprove = async () => {
    try {
      const tx = await approve()
      const confirmed = await waitForTxEvent(tx, "Approval")
      if (confirmed) {
        toast({
          description: "Approved",
          position: "top-right",
          status: "success",
          isClosable: true,
        })
        setIsApproved(true)
      }
    } catch (e) {
      if (e.code === 4001) {
        toast({ description: "Transaction rejected", position: "top-right", status: "error" })
      } else {
        console.log(e)
      }
    }
  }

  const BusinessHeader = () => {
    return (
      <HStack mt={3} mb={4} align="stretch" justify="flex-start">
        <Box>
          <Avatar mb={4} h="50px" w="50px" src={business.logoUrl ?? ""} />
        </Box>
        <Box>
          <Heading mx={1} size="header">
            {business.name}
          </Heading>
          <ViewStorefrontButton handle={business.handle} />
        </Box>
      </HStack>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>
          Underwrite Business
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <BusinessHeader />
          <UnderwriteForm business={business} submit={handleStake} approve={handleApprove} />
        </ModalBody>
        {/* <ModalFooter></ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default UnderwriteModal
