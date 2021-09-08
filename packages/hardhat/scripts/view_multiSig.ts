import { config, ethers } from "hardhat"
import { CeloProvider } from "@celo-tools/celo-ethers-wrapper"
import { MultiSigWallet__factory } from "../types"
import { HttpNetworkConfig } from "hardhat/types"
import { MultiSigWallet } from "../types/MultiSigWallet"
import { CIP36__factory } from "../types/factories/CIP36__factory"
import { CIP36 } from "../types/CIP36"

async function main(): Promise<void> {
  const connectionInfo = config.networks["celo-alfajores"] as HttpNetworkConfig
  console.log(connectionInfo)
  const provider = new CeloProvider(connectionInfo.url)
  await provider.ready

  const multiSigAddress = "0x7fB7a463A9817C88aF7F223242968Ce882A0D7fD"
  const RUSDAddress = "0x38997d2F993b94667F63517774888B5b404DbdBc"

  const multiSigContract = new ethers.Contract(
    multiSigAddress,
    MultiSigWallet__factory.createInterface(),
    provider,
  ) as MultiSigWallet

  const owners = await multiSigContract.getOwners()
  console.log(owners)
  const RUSDContract = new ethers.Contract(
    RUSDAddress,
    CIP36__factory.createInterface(),
    provider,
  ) as CIP36

  const creditLimit = ethers.utils.formatUnits(
    await RUSDContract.creditLimitOf(multiSigAddress),
    "mwei",
  )
  const creditBalance = ethers.utils.formatUnits(
    await RUSDContract.creditBalanceOf(multiSigAddress),
    "mwei",
  )
  const balance = ethers.utils.formatUnits(await RUSDContract.balanceOf(multiSigAddress), "mwei")
  console.log("credit limit: ", creditLimit)
  console.log("credit balance: ", creditBalance)
  console.log("balance: ", balance)
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })
