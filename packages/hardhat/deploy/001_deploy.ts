import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const { deployer, coSigner } = await hardhat.getNamedAccounts()
  //deploy network registry
  const networkRegistryAbi = (await hardhat.artifacts.readArtifact("NetworkRegistry")).abi
  const networkArgs = [[], [coSigner]]
  const networkRegistry = await deployProxyAndSave(
    "NetworkRegistry",
    networkArgs,
    hardhat,
    networkRegistryAbi,
  )

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
  const underwriterManager = await deployProxyAndSave(
    "UnderwriteManager",
    underwriteManagerArgs,
    hardhat,
    underwriteManagerAbi,
  )

  // // rUSD deploy
  const rUSDAbi = (await hardhat.artifacts.readArtifact("RUSD")).abi
  const rUSDArgs = [networkRegistry.address, 20, underwriterManager.address]

  console.log(rUSDArgs)

  await deployProxyAndSave("RUSD", rUSDArgs, hardhat, rUSDAbi, { initializer: "initializeRUSD" })
}
export default func
