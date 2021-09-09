import { useEffect } from "react"
import { atom, DefaultValue, selector, useRecoilState } from "recoil"
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
  const [, setIsApproved] = useIsApprovedState()
  const { approve } = useMututalityTokenContract()
  return async () =>
    (await approve("0x00"))
      .wait()
      .then(() => setIsApproved(false))
      .then(() => console.log("utils.tsx -- done"))
}

export const useIsApprovedState = (): any => {
  const [isApproved, setIsApproved] = useRecoilState(isApprovedSelector)
  const { allowance } = useMututalityTokenContract()

  // check for approval on load
  useEffect(() => {
    allowance()
      .then((result) => setIsApproved(Number(result) > 0))
      .catch(() => setIsApproved(false))
  }, [])

  return [isApproved, setIsApproved]
}

export const MIN_CREDIT_LINE = 600
