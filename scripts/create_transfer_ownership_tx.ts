import { config, deployments, ethers } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const senderAddress = "0x4400b73aD6a62b3d0096FB2AF9743D3F513De2c0"
  const newAddress = "0xdbef374fdf8d735e7589a9a9e2c5a091eb2dbe57"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const tokenContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    new ethers.VoidSigner(senderAddress).connect(ethers.provider),
  ) as SourceToken

  try {
    const tx = await tokenContract.populateTransaction.transferOwnership(newAddress)

    console.log("address: ", sourceTokenAddress)
    console.log("data: ", tx.data)
  } catch (e) {
    console.log(e)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })
