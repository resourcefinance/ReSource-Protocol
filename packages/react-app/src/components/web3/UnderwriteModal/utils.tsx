import { useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { atom, DefaultValue, selector, useRecoilState, useSetRecoilState } from "recoil"
import { useMututalityTokenContract } from "../../../services/web3/contracts"

export const underwriteModalAtom = atom({
  key: "underwriteModalAtom",
  default: {
    isApproved: false,
  },
})

export const isApprovedSelector = selector({
  key: "isApprovedSelector",
  get: ({ get }) => get(underwriteModalAtom).isApproved,
  set: ({ set }, newValue: boolean | DefaultValue) => {
    const val = newValue instanceof DefaultValue ? false : newValue
    set(underwriteModalAtom, (prev) => ({ ...prev, isApproved: val }))
  },
})

// only used for developement convenience
export const useRevertApproval = () => {
  const { approve } = useMututalityTokenContract()
  return async () => approve("0x00")
}

export const useIsApprovedState = () => {
  const [isApproved, setIsApproved] = useRecoilState(isApprovedSelector)
  const { allowance } = useMututalityTokenContract()

  // check for approval on load
  useEffect(() => {
    allowance()
      .then((result) => setIsApproved(Number(result) > 0))
      .catch(() => setIsApproved(false))
  }, [])

  return isApproved
}

export const useListenForApproval = () => {
  const { contract } = useMututalityTokenContract()
  const setIsApproved = useSetRecoilState(isApprovedSelector)
  const toast = useToast()

  return async () => {
    contract.once("Approval", async (args) => {
      toast({
        description: "Approved",
        position: "top-right",
        status: "success",
        isClosable: true,
      })
      setIsApproved(true)
    })
  }
}
