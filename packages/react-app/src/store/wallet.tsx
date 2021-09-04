import { ethers } from "ethers"
import { useCallback } from "react"
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { useWeb3Context } from "web3-react"
import { CONTRACTS } from "../constants"
import { MutualityToken, MutualityToken__factory } from "../contracts"
import { useMututalityTokenContract } from "../services/web3/contracts"

interface Props {
  balance: string
  loading: boolean
  error: boolean
}

const defaultWalletState: Props = {
  balance: "00.0",
  loading: false,
  error: false,
}

export const walletAtom = atom<{ balance: string; loading: boolean; error: boolean }>({
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
  const { balance, loading, error } = useRecoilValue(walletAtom)
  return { balance, loading, error }
}

export const useFetchBalance = () => {
  const setWallet = useSetRecoilState(walletAtom)
  const { balanceOf } = useMututalityTokenContract()

  return useCallback(() => {
    setWallet((prevState) => ({ ...prevState, loading: true }))
    balanceOf().then((value) => {
      setWallet((prevState) => ({
        ...prevState,
        balance: ethers.utils.formatEther(value),
        loading: false,
      }))
    })
  }, [setWallet])
}
