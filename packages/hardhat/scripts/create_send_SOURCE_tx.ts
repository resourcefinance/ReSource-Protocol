import { config, deployments, ethers } from "hardhat"
import { SourceToken__factory } from "../types"

async function main(): Promise<void> {
  const senderAddress = "0x3DC674FAB7eB6e6B3925d02A3D3F566CdAe3354f"
  const address = "0x2E8c10e4E7f213641C238a595D005EecA36f7F7A"
  const amount = "25000"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const tokenContract = SourceToken__factory.connect(
    sourceTokenAddress,
    new ethers.VoidSigner(senderAddress).connect(ethers.provider)
  )

  try {
    const now = Date.parse(new Date().toString()) / 1000
    const day = 86405
    const halfDay = 43200
    const tx = await tokenContract.populateTransaction.transfer(
      address,
      ethers.utils.parseEther(amount)
    )
    // const tx = await tokenContract.populateTransaction.transferWithLock(address, {
    //   totalAmount: ethers.utils.parseEther(amount),
    //   amountStaked: 0,
    //   schedules: [
    //     {
    //       amount: ethers.utils.parseEther(amount),
    //       expirationBlock: now + day + halfDay,
    //     },
    //   ],
    // })

    // await tokenContract.estimateGas.transferWithLock(address, {
    //   totalAmount: ethers.utils.parseEther(amount),
    //   amountStaked: 0,
    //   schedules: [
    //     {
    //       amount: ethers.utils.parseEther(amount),
    //       expirationBlock: now + day * 7,
    //     },
    //   ],
    // })

    await tokenContract.estimateGas.transfer(address, ethers.utils.parseEther(amount))

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
