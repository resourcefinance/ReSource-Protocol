import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, ethers } from "hardhat"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const { relaySigner } = await hardhat.getNamedAccounts()

  // reSourceToken deploy
  const reSourceTokenAbi = (await hardhat.artifacts.readArtifact("ReSourceToken")).abi
  const reSourceTokenArgs = [hardhat.ethers.utils.parseEther("100000000"), []]

  const reSourceTokenAddress = await deployProxyAndSave(
    "ReSourceToken",
    reSourceTokenArgs,
    hardhat,
    reSourceTokenAbi,
  )

  // hardhat-deploy takes care of saving deployment artifact
  const vesting = await deployments.deploy("TokenVesting", {
    from: (await hardhat.ethers.getSigners())[0].address,
    args: [reSourceTokenAddress],
  })
  console.log(`🚀  TokenVesting ${!vesting.newlyDeployed ? "already" : ""} deployed`)
}
export default func
func.tags = ["SOURCE"]
