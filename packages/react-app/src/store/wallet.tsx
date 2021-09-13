import { ethers } from "ethers"
import { useCallback } from "react"
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { useGetTotalCollateralLazyQuery } from "../generated/subgraph/graphql"
import { useMututalityTokenContract } from "../services/web3/contracts"
import { useGetMyWalletAddress } from "../services/web3/utils/useGetMyWalletAddress"

interface Props {
  balance: string
  totalCollateral: string
  loading: boolean
  error: boolean
}

const defaultWalletState: Props = {
  balance: "00.0",
  totalCollateral: "00.0",
  loading: false,
  error: false,
}

export const walletAtom = atom<{
  balance: string
  totalCollateral: string
  loading: boolean
  error: boolean
}>({
  key: "walletAtom",
  default: defaultWalletState,
})

export const balanceSelector = selector({
  key: "walletSelector",
  get: ({ get }) => get(walletAtom).balance,
  set: ({ set, get }, { wallet }: any) => {
    set(walletAtom, (prevState) => ({ ...prevState, wallet }))
  },
})

export const useGetWallet = () => {
  const { balance, totalCollateral, loading, error } = useRecoilValue(walletAtom)
  return { balance, totalCollateral, loading, error }
}

export const useFetchWallet = () => {
  const myWalletAddress = useGetMyWalletAddress()
  const setWallet = useSetRecoilState(walletAtom)
  const { balanceOf } = useMututalityTokenContract()
  const [fetchTotalCollateral] = useGetTotalCollateralLazyQuery({
    onCompleted: ({ underwriter }) => {
      if (!underwriter) return
      const totalCollateral = Number(underwriter.totalCollateral) / 1000000000000000000
      setWallet((prevState) => ({
        ...prevState,
        totalCollateral: totalCollateral.toString(),
        loading: false,
      }))
    },
  })

  return useCallback(() => {
    if (!myWalletAddress) return
    setWallet((prevState) => ({ ...prevState, loading: true }))
    // TODO: figure out why this is not being called on modal close
    fetchTotalCollateral({ variables: { id: myWalletAddress } })
    balanceOf().then((value) => {
      setWallet((prevState) => ({
        ...prevState,
        balance: ethers.utils.formatEther(value),
        loading: false,
      }))
    })
  }, [setWallet])
}
