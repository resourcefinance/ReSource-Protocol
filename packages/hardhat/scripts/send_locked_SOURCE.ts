import { config, deployments, ethers } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const address = "0x8bb2af5d4877345aAc16c89d7147D4CC73D808AA"
  const amountStr = "500000"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address
  console.log(sourceTokenAddress)

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const amount = ethers.utils.parseEther(amountStr)
  const signer = (await ethers.getSigners())[0]

  const tokenContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    signer,
  ) as SourceToken

  try {
    const now = Date.parse(new Date().toString()) / 1000
    const day = 86405
    await (
      await tokenContract.transferWithLock(address, {
        totalAmount: ethers.utils.parseEther(amountStr),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther(amountStr),
            expirationBlock: now + day * 7,
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
