import { ethers } from "ethers"

export const waitForTxEvent = async (
  tx: ethers.ContractTransaction,
  eventName: string,
): Promise<boolean> => {
  return tx.wait().then((res) => {
    return res.events?.some((e) => e.event === eventName) || false
  })
}
