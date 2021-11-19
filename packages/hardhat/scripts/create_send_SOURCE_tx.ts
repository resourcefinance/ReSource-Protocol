import { config, deployments, ethers } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const senderAddress = "0x3987426f3C429214BC078750948461A2abe03ec7"
  const address = "0x4400b73aD6a62b3d0096FB2AF9743D3F513De2c0"
  const amount = "1000"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const tokenContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    new ethers.VoidSigner(senderAddress).connect(ethers.provider),
  ) as SourceToken

  try {
    const now = Date.parse(new Date().toString()) / 1000
    const day = 86405
    const halfDay = 43200
    const tx = await tokenContract.populateTransaction.transferWithLock(address, {
      totalAmount: ethers.utils.parseEther(amount),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther(amount),
          expirationBlock: now + day + halfDay,
        },
      ],
    })

    await tokenContract.estimateGas.transferWithLock(address, {
      totalAmount: ethers.utils.parseEther(amount),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther(amount),
          expirationBlock: now + day * 7,
        },
      ],
    })

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
