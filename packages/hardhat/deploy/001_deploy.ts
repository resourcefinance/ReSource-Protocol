import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction, DeploymentSubmission } from "hardhat-deploy/types"
import { RUSD } from "../types/RUSD"
import { NetworkRegistry } from "../types/NetworkRegistry"
import { MutualityToken } from "../types/MutualityToken"
import { UnderwriteManager } from "../types/UnderwriteManager"
// import { ethers } from "ethers"
import { NetworkRegistry__factory } from "../../react-app/src/contracts/factories/NetworkRegistry__factory"
import { saveDeployment } from "../utils"
import { MutualityToken__factory } from "../../react-app/src/contracts/factories/MutualityToken__factory"
import { UnderwriteManager__factory } from "../../react-app/src/contracts/factories/UnderwriteManager__factory"
import { RUSD__factory } from "../../react-app/src/contracts/factories/RUSD__factory"

const func: DeployFunction = async function({
  getNamedAccounts,
  deployments,
  upgrades,
  ethers,
  getChainId,
  network,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts()

  //deploy network registry
  const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")
  const networkRegistryAbi = NetworkRegistry__factory.abi

  const networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
    [],
    [],
  ])) as NetworkRegistry
  const networkRegistryAddress = networkRegistry.address

  await saveDeployment("NetworkRegistry", deployments, networkRegistry, networkRegistryAbi)

  // mutuality deploy
  const mutualityTokenFactory = await ethers.getContractFactory("MutualityToken")
  const mutualityTokenAbi = MutualityToken__factory.abi

  const mutualityToken = (await upgrades.deployProxy(mutualityTokenFactory, [
    ethers.utils.parseEther("10000000"),
  ])) as MutualityToken

  const mutualityTokenAddress = mutualityToken.address

  await saveDeployment("MutualityToken", deployments, mutualityToken, mutualityTokenAbi)

  // underwriteManager deploy
  const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")
  const underwriteManagerAbi = UnderwriteManager__factory.abi

  const underwriteManager = (await upgrades.deployProxy(underwriteManagerFactory, [
    mutualityTokenAddress,
  ])) as UnderwriteManager

  const underwriteManagerAddress = underwriteManager.address

  await saveDeployment("UnderwriteManager", deployments, underwriteManager, underwriteManagerAbi)

  // // rUSD deploy
  const rUSDFactory = await ethers.getContractFactory("RUSD")
  const rUSDAbi = RUSD__factory.abi

  const rUSD = (await upgrades.deployProxy(
    rUSDFactory,
    [networkRegistryAddress, 20, underwriteManagerAddress],
    {
      initializer: "initializeRUSD",
    },
  )) as RUSD

  await saveDeployment("RUSD", deployments, rUSD, rUSDAbi)
}
export default func
