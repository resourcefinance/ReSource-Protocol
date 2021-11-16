import { config, deployments, ethers } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const address = "0xE6BFb75fD6a9f73926EF9a580FD2107762497F8e"
  const amount = "1"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address
  console.log(sourceTokenAddress)

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const tokenContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    signer,
  ) as SourceToken

  try {
    const now = Date.parse(new Date().toString()) / 1000
    const day = 86405
    const halfDay = 43200
    await (
      await tokenContract.transferWithLock(address, {
        totalAmount: ethers.utils.parseEther(amount),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther(amount),
            expirationBlock: now + day + halfDay,
          },
        ],
      })
    ).wait()

    console.log("funds transfered")
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
