import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { saveDeployment } from "../utils"
import { retry } from "ts-retry"

const func: DeployFunction = async function({
  getNamedAccounts,
  deployments,
  artifacts,
  upgrades,
  ethers,
  getChainId,
  network,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts()

  //deploy network registry
  const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")

  const networkRegistryAbi = (await artifacts.readArtifact("NetworkRegistry")).abi

  let networkRegistry
  await retry(
    async () => {
      networkRegistry = await upgrades.deployProxy(networkRegistryFactory, [[], []])
    },
    { delay: 200, maxTry: 10 },
  )
  const networkRegistryAddress = networkRegistry.address

  await saveDeployment("NetworkRegistry", deployments, networkRegistry, networkRegistryAbi)

  // reSourceToken deploy
  const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")
  const reSourceTokenAbi = (await artifacts.readArtifact("ReSourceToken")).abi

  let reSourceToken
  await retry(
    async () => {
      reSourceToken = await upgrades.deployProxy(reSourceTokenFactory, [
        ethers.utils.parseEther("10000000"),
      ])
    },
    { delay: 200, maxTry: 10 },
  )

  const reSourceTokenAddress = reSourceToken.address

  await saveDeployment("ReSourceToken", deployments, reSourceToken, reSourceTokenAbi)

  // underwriteManager deploy
  const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")
  const underwriteManagerAbi = (await artifacts.readArtifact("UnderwriteManager")).abi

  let underwriteManager
  await retry(
    async () => {
      underwriteManager = await upgrades.deployProxy(underwriteManagerFactory, [
        reSourceTokenAddress,
      ])
    },
    { delay: 200, maxTry: 10 },
  )

  const underwriteManagerAddress = underwriteManager.address

  await saveDeployment("UnderwriteManager", deployments, underwriteManager, underwriteManagerAbi)

  // // rUSD deploy
  const rUSDFactory = await ethers.getContractFactory("RUSD")
  const rUSDAbi = (await artifacts.readArtifact("RUSD")).abi

  let rUSD
  await retry(
    async () => {
      rUSD = await upgrades.deployProxy(
        rUSDFactory,
        [networkRegistryAddress, 20, underwriteManagerAddress],
        {
          initializer: "initializeRUSD",
        },
      )
    },
    { delay: 200, maxTry: 10 },
  )

  await saveDeployment("RUSD", deployments, rUSD, rUSDAbi)
}
export default func
