import { Box, BoxProps, Button, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Business } from "../../../generated/resource-network/graphql"
import { useGetUnderwriteeQuery } from "../../../generated/subgraph/graphql"
import { useGetMyWalletAddress } from "../../../services/web3/utils/useGetMyWalletAddress"
import ExtendCreditModal from "../modals/ExtendCreditModal"
import UnderwriteModal from "../modals/UnderwriteModal"

interface Props extends BoxProps {
  business?: Business | null
}
export const UnderwriteModalContainer = ({ business, ...props }: Props) => {
  const underwriteModal = useDisclosure()
  const extendCreditModal = useDisclosure()
  const myWalletAddress = useGetMyWalletAddress()

  const id = business?.wallet?.multiSigAddress?.toLowerCase() ?? ""
  const { data, loading, called, refetch } = useGetUnderwriteeQuery({
    variables: { id: id },
    skip: !id,
  })

  const underwriterAddress = data?.underwritee?.creditLine?.underwriter.id
  const currentlyUnderwriting = underwriterAddress === myWalletAddress
  const isUnavailable = !!underwriterAddress && underwriterAddress !== myWalletAddress

  if (!business || !called) return null

  return (
    <Box>
      <Button
        variant="primary"
        colorScheme="blue"
        isLoading={loading}
        isDisabled={isUnavailable}
        onClick={currentlyUnderwriting ? extendCreditModal.onOpen : underwriteModal.onOpen}
      >
        {currentlyUnderwriting ? "Extend credit" : isUnavailable ? "Unavailable" : "Underwrite"}
      </Button>
      <UnderwriteModal
        business={business}
        isOpen={underwriteModal.isOpen}
        onClose={(shouldRefetch) => {
          if (!shouldRefetch) return
          delay(3000)
            .then(() => refetch())
            .finally(underwriteModal.onClose)
        }}
      />
      <ExtendCreditModal
        business={business}
        isOpen={extendCreditModal.isOpen}
        onClose={extendCreditModal.onClose}
      />
    </Box>
  )
}

export const delay = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
