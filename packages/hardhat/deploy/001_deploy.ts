import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils"
import { UnderwriteManager } from "../types"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const { deployer, relaySigner } = await hardhat.getNamedAccounts()

  //deploy walletDeployer contract
  const walletDeployerAbi = (await hardhat.artifacts.readArtifact("IiKeyWalletDeployer")).abi
  const walletDeployer = await deployProxyAndSave(
    "iKeyWalletDeployer",
    [],
    hardhat,
    walletDeployerAbi,
  )

  //deploy network registry and transfer networkRegistry ownership
  const networkRegistryAbi = (await hardhat.artifacts.readArtifact("NetworkRegistry")).abi
  const networkArgs = [[], [relaySigner], walletDeployer.address]
  const networkRegistry = await deployProxyAndSave(
    "NetworkRegistry",
    networkArgs,
    hardhat,
    networkRegistryAbi,
  )
  await (await walletDeployer.transferOwnership(networkRegistry.address)).wait()

  // reSourceToken deploy
  const reSourceTokenAbi = (await hardhat.artifacts.readArtifact("ReSourceToken")).abi
  const reSourceTokenArgs = [hardhat.ethers.utils.parseEther("10000000")]

  const resourceToken = await deployProxyAndSave(
    "ReSourceToken",
    reSourceTokenArgs,
    hardhat,
    reSourceTokenAbi,
  )

  // underwriteManager deploy
  const underwriteManagerAbi = (await hardhat.artifacts.readArtifact("UnderwriteManager")).abi
  const underwriteManagerArgs = [resourceToken.address]
  const underwriterManager = (await deployProxyAndSave(
    "UnderwriteManager",
    underwriteManagerArgs,
    hardhat,
    underwriteManagerAbi,
  )) as UnderwriteManager

  // rUSD deploy
  const rUSDAbi = (await hardhat.artifacts.readArtifact("RUSD")).abi
  const rUSDArgs = [networkRegistry.address, 20, underwriterManager.address, relaySigner]

  const RUSD = await deployProxyAndSave("RUSD", rUSDArgs, hardhat, rUSDAbi, {
    initializer: "initializeRUSD",
  })

  // add RUSD to underwriteManager networks

  await underwriterManager.addNetwork(RUSD.address)
}
export default func
