import { config, deployments, ethers } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const address = "0x0bBE7BCF8cd7D0f7aeC93A9afa90eE9bE91D8015"
  const amountStr = "1000000"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address

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
