import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, deployments, upgrades } from "hardhat"

async function main(): Promise<void> {
  const UnderwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")

  const proxy = await deployments.get("UnderwriteManager")
  console.log(proxy.address)
  const upgradeResponse = await upgrades.upgradeProxy(proxy.address, UnderwriteManagerFactory)
  console.log(upgradeResponse)

  // TODO: store deployment
  // await saveDeployment("ReSourceTokenV2", deployments, reSourceToken, ReSourceTokenV2Abi)
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })
