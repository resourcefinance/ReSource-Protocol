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
  console.log("WalletDeployer deployed")

  //deploy network registry and transfer networkRegistry ownership
  const networkRegistryAbi = (await hardhat.artifacts.readArtifact("NetworkRegistry")).abi
  const networkArgs = [[], [relaySigner], walletDeployer.address]
  const networkRegistry = await deployProxyAndSave(
    "NetworkRegistry",
    networkArgs,
    hardhat,
    networkRegistryAbi,
  )
  try {
    await (await walletDeployer.transferOwnership(networkRegistry.address)).wait()
  } catch (e) {
    console.log(e)
  }
  console.log("NetworkRegistry deployed")

  // reSourceToken deploy
  const reSourceTokenAbi = (await hardhat.artifacts.readArtifact("ReSourceToken")).abi
  const reSourceTokenArgs = [hardhat.ethers.utils.parseEther("10000000")]

  const resourceToken = await deployProxyAndSave(
    "ReSourceToken",
    reSourceTokenArgs,
    hardhat,
    reSourceTokenAbi,
  )

  console.log("ReSourceToken deployed")

  // underwriteManager deploy
  const underwriteManagerAbi = (await hardhat.artifacts.readArtifact("UnderwriteManager")).abi
  const underwriteManagerArgs = [resourceToken.address]
  const underwriteManager = (await deployProxyAndSave(
    "UnderwriteManager",
    underwriteManagerArgs,
    hardhat,
    underwriteManagerAbi,
  )) as UnderwriteManager

  await (await resourceToken.updateStakableContract(underwriteManager.address, true)).wait()

  console.log("UnderwriteManager deployed")

  // rUSD deploy
  const rUSDAbi = (await hardhat.artifacts.readArtifact("RUSD")).abi
  const rUSDArgs = [networkRegistry.address, 20, underwriteManager.address, relaySigner]

  const RUSD = await deployProxyAndSave("RUSD", rUSDArgs, hardhat, rUSDAbi, {
    initializer: "initializeRUSD",
  })

  console.log("RUSD deployed")
  // add RUSD to underwriteManager networks

  await underwriteManager.addNetwork(RUSD.address)
}
export default func
