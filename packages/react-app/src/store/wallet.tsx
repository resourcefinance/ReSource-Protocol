import { ethers } from "ethers"
import { useCallback } from "react"
import { atom, useRecoilValue, useSetRecoilState } from "recoil"
import { useGetTotalCollateralLazyQuery } from "../generated/subgraph/graphql"
import { useMututalityTokenContract } from "../services/web3/contracts"
import { useGetMyWalletAddress } from "../services/web3/utils/useGetMyWalletAddress"
import { delay } from "../utils/delay"

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

export const useGetWallet = () => {
  const { balance, totalCollateral, loading, error } = useRecoilValue(walletAtom)
  return { balance, totalCollateral, loading, error }
}

export const useFetchWallet = () => {
  const myWalletAddress = useGetMyWalletAddress()
  const setWallet = useSetRecoilState(walletAtom)
  const { balanceOf } = useMututalityTokenContract()
  const [fetchTotalCollateral, { startPolling, stopPolling }] = useGetTotalCollateralLazyQuery({
    fetchPolicy: "network-only",
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

  return useCallback(async () => {
    if (!myWalletAddress) return
    setWallet((prevState) => ({ ...prevState, loading: true }))
    balanceOf().then((value) => {
      setWallet((prevState) => ({
        ...prevState,
        balance: ethers.utils.formatEther(value),
        loading: false,
      }))
    })
    fetchTotalCollateral({ variables: { id: myWalletAddress } })
  }, [balanceOf, fetchTotalCollateral, myWalletAddress, setWallet])
}
