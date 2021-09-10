import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { saveDeployment } from "../utils"

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

  const networkRegistry = await upgrades.deployProxy(networkRegistryFactory, [[], []])
  const networkRegistryAddress = networkRegistry.address

  await saveDeployment("NetworkRegistry", deployments, networkRegistry, networkRegistryAbi)

  // resourceToken deploy
  const resourceTokenFactory = await ethers.getContractFactory("ResourceToken")
  const resourceTokenAbi = (await artifacts.readArtifact("ResourceToken")).abi

  const resourceToken = await upgrades.deployProxy(resourceTokenFactory, [
    ethers.utils.parseEther("10000000"),
  ])

  const resourceTokenAddress = resourceToken.address

  await saveDeployment("ResourceToken", deployments, resourceToken, resourceTokenAbi)

  // underwriteManager deploy
  const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")
  const underwriteManagerAbi = (await artifacts.readArtifact("UnderwriteManager")).abi

  const underwriteManager = await upgrades.deployProxy(underwriteManagerFactory, [
    resourceTokenAddress,
  ])

  const underwriteManagerAddress = underwriteManager.address

  await saveDeployment("UnderwriteManager", deployments, underwriteManager, underwriteManagerAbi)

  // // rUSD deploy
  const rUSDFactory = await ethers.getContractFactory("RUSD")
  const rUSDAbi = (await artifacts.readArtifact("RUSD")).abi

  const rUSD = await upgrades.deployProxy(
    rUSDFactory,
    [networkRegistryAddress, 20, underwriteManagerAddress],
    {
      initializer: "initializeRUSD",
    },
  )

  await saveDeployment("RUSD", deployments, rUSD, rUSDAbi)
}
export default func
