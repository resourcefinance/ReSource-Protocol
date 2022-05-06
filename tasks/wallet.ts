import { task } from "hardhat/config"

import { TASK_WALLET } from "./task-names"

task(TASK_WALLET, "Create a wallet (pk) link", async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom()
  const privateKey = randomWallet._signingKey().privateKey
  console.log("🔐 WALLET Generated as " + randomWallet.address + "")
  console.log("pk: " + privateKey)
})
