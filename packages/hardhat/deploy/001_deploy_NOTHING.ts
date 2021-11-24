import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, ethers } from "hardhat"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const { relaySigner } = await hardhat.getNamedAccounts()

  // nothingToken deploy
  const nothingTokenAbi = (await hardhat.artifacts.readArtifact("NothingToken")).abi
  const nothingTokenArgs = [hardhat.ethers.utils.parseEther("100000000"), []]

  await deployProxyAndSave("NothingToken", nothingTokenArgs, hardhat, nothingTokenAbi)
}
export default func
func.tags = ["NOTHING"]
