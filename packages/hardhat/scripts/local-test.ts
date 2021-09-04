import { ethers, getNamedAccounts } from "hardhat"
import { UnderwriteManager } from "../types/UnderwriteManager"
import { UnderwriteManager__factory } from "../../react-app/src/contracts/factories/UnderwriteManager__factory"
import { MutualityToken__factory } from "../../react-app/src/contracts/factories/MutualityToken__factory"
import { MutualityToken } from "../../react-app/src/contracts/MutualityToken"
import { parseEther } from "ethers/lib/utils"
import { readFileSync } from "fs"
import { NetworkRegistry__factory } from "../../react-app/src/contracts/factories/NetworkRegistry__factory"
import { NetworkRegistry } from "../../react-app/src/contracts/NetworkRegistry"
const fs = require("fs")

const underwriteAbi = "./deployments/localhost/UnderwriteManager_Proxy.json"
const mutualityAbi = "./deployments/localhost/MutualityToken_Proxy.json"
const rUSDAbi = "./deployments/localhost/RUSD_Proxy.json"
const networkRegistryAbi = "./deployments/localhost/NetworkRegistry_Proxy.json"

async function test() {
  try {
    let underwriteContract = fs.readFileSync(underwriteAbi).toString()
    underwriteContract = JSON.parse(underwriteContract)
    const underwriteAddress = underwriteContract.address

    let mutualityContract = fs.readFileSync(mutualityAbi).toString()
    mutualityContract = JSON.parse(mutualityContract)
    const mutualityAddress = mutualityContract.address

    let rUSDContract = fs.readFileSync(rUSDAbi).toString()
    rUSDContract = JSON.parse(rUSDContract)
    const rUSDAddress = rUSDContract.address

    let networkRegistryContract = fs.readFileSync(networkRegistryAbi).toString()
    networkRegistryContract = JSON.parse(networkRegistryContract)
    const networkRegistryAddress = networkRegistryContract.address

    const deployer = (await ethers.getSigners())[0]

    const underwriteManager = UnderwriteManager__factory.getContract(
      underwriteAddress,
      UnderwriteManager__factory.createInterface(),
      deployer,
    ) as UnderwriteManager

    const mutualityToken = MutualityToken__factory.getContract(
      mutualityAddress,
      MutualityToken__factory.createInterface(),
      deployer,
    ) as MutualityToken

    const networkRegistry = NetworkRegistry__factory.getContract(
      networkRegistryAddress,
      NetworkRegistry__factory.createInterface(),
      deployer,
    ) as NetworkRegistry
    const curMembers = await networkRegistry.getMembers()
    const member = ethers.Wallet.createRandom()
    if (!curMembers.includes(member.address))
      await (await networkRegistry.connect(deployer).addMember(member.address)).wait()

    const underwriter = ethers.Wallet.createRandom().connect(ethers.provider)
    const tx = {
      to: underwriter.address,
      value: ethers.utils.parseEther("100"),
    }
    await (await deployer.sendTransaction(tx)).wait()

    await (
      await mutualityToken
        .connect(deployer)
        .transfer(underwriter.address, ethers.utils.parseEther("10000.0"))
    ).wait()

    await (
      await mutualityToken
        .connect(underwriter)
        .approve(
          underwriteAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        )
    ).wait()

    await (
      await underwriteManager
        .connect(underwriter)
        .underwrite(rUSDAddress, ethers.utils.parseEther("1000.0"), member.address)
    ).wait()
  } catch (e) {
    console.log(e)
  }
}

async function main() {
  await test()
  console.log("Local test complete.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
