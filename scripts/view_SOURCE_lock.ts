import { config, deployments, ethers } from "hardhat"
import { SourceToken__factory } from "../types"
import { SourceToken } from "../types/SourceToken"

async function main(): Promise<void> {
  const address = "0x0bBE7BCF8cd7D0f7aeC93A9afa90eE9bE91D8015"

  let sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const tokenContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    new ethers.VoidSigner(address).connect(ethers.provider),
  ) as SourceToken

  try {
    const locks = await tokenContract.locks(address)
    const schedules = await tokenContract.getLockSchedules(address)
    console.log(schedules)
    console.log("address: ", sourceTokenAddress)
    console.log(locks)
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
