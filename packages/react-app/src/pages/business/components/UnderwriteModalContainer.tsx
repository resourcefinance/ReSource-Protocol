import { Box, BoxProps, Button, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useWeb3Context } from "web3-react"
import { Business } from "../../../generated/resource-network/graphql"
import { useGetCreditLineQuery, useGetUnderwriteeQuery } from "../../../generated/subgraph/graphql"
import { useGetCreditLineId } from "../../../services/web3/utils/useGetCreditLineId"
import ExtendCreditModal from "../modals/ExtendCreditModal"
import UnderwriteModal from "../modals/UnderwriteModal"

interface Props extends BoxProps {
  business?: Business | null
}
export const UnderwriteModalContainer = ({ business, ...props }: Props) => {
  const underwriteModal = useDisclosure()
  const extendCreditModal = useDisclosure()
  const id = useGetCreditLineId(business)
  const { data, loading, called } = useGetCreditLineQuery({ variables: { id }, skip: !id })
  const [isUnderwritingBusiness, setIsUnderwritingBusiness] = useState(!!data?.creditLine?.id)
  const alreadyUnderwritten = false //!!creditLine?.underwriter.id

  useEffect(() => {
    setIsUnderwritingBusiness(!!data?.creditLine?.id)
  }, [data?.creditLine?.id])

  // const { account } = useWeb3Context()
  // const id = business?.wallet?.multiSigAddress ?? ""
  // const { data, loading, called } = useGetUnderwriteeQuery({ variables: { id }, skip: !id })
  // const creditLine = data?.underwritee?.creditLine
  // console.log("UnderwriteModalContainer.tsx --  creditLine", creditLine)
  // console.log("UnderwriteModalContainer.tsx --  data.underwritee", data?.underwritee)
  // const alreadyUnderwritten = !!creditLine?.underwriter.id
  // const isUnderwritingBusiness = creditLine?.underwriter.id === account

  console.log("UnderwriteModalContainer.tsx --  id", id)

  if (!business || !called) return null

  return (
    <Box>
      <Button
        variant="primary"
        colorScheme="blue"
        isLoading={loading}
        isDisabled={alreadyUnderwritten}
        onClick={isUnderwritingBusiness ? extendCreditModal.onOpen : underwriteModal.onOpen}
      >
        {alreadyUnderwritten
          ? "Unavailable"
          : isUnderwritingBusiness
          ? "Extend credit"
          : "Underwrite"}
      </Button>
      <UnderwriteModal
        isOpen={underwriteModal.isOpen}
        onClose={() => {
          underwriteModal.onClose()
          setIsUnderwritingBusiness(true)
        }}
        business={business}
      />
      <ExtendCreditModal
        isOpen={extendCreditModal.isOpen}
        onClose={extendCreditModal.onClose}
        business={business}
      />
    </Box>
  )
}

export const delay = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
