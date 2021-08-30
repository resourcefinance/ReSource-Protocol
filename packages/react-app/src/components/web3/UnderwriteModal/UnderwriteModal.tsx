import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useCheckApproved } from "../../../services/web3/mutuality"
import ApproveMuButton from "./ApproveMuButton"
import UnderwriteMuButton from "./UnderwriteMuButton"
import { CONTRACTS } from "../../../constants"
import { Business } from "../../../generated/graphql"

export interface UnderwriteModalProps {
  onClose: () => void
  isOpen: boolean
  business: Business
}

const UnderwriteModal = ({ isOpen, onClose, business }: UnderwriteModalProps) => {
  const [isApproved, setIsApproved] = useState(false)
  const checkApproved = useCheckApproved()
  const [collateralAmount, setCollateralAmount] = useState("0")
  const [networkToken, setNetworkToken] = useState("")

  const underwritee = business.wallet?.multiSigAddress

  useEffect(() => {
    const check = async () => {
      try {
        const approved = await checkApproved()
        console.log(approved)
        setIsApproved(approved)
      } catch (e) {
        console.log(e)
        setIsApproved(false)
      }
    }
    check()
    setNetworkToken(CONTRACTS.RUSDToken)
  }, [])

  if (!underwritee) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m="1em">
        <ModalHeader>
          Underwrite Business
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <HStack>
            <ApproveMuButton isApproved={isApproved} setIsApproved={setIsApproved} />
            <UnderwriteMuButton
              isApproved={isApproved}
              collateralAmount={collateralAmount}
              networkTokenAddress={networkToken}
              underwritee={underwritee}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UnderwriteModal
