import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, ethers } from "hardhat"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const { relaySigner } = await hardhat.getNamedAccounts()

  // sourceToken deploy
  const sourceTokenAbi = (await hardhat.artifacts.readArtifact("SourceToken")).abi
  const sourceTokenArgs = [hardhat.ethers.utils.parseEther("100000000"), []]

  const sourceTokenAddress = await deployProxyAndSave(
    "SourceToken",
    sourceTokenArgs,
    hardhat,
    sourceTokenAbi,
  )

  // hardhat-deploy takes care of saving deployment artifact
  const vesting = await deployments.deploy("TokenVesting", {
    from: (await hardhat.ethers.getSigners())[0].address,
    args: [sourceTokenAddress],
  })
  console.log(
    `${!vesting.newlyDeployed ? "✅ TokenVesting already deployed" : "🚀  TokenVesting deployed"}`,
  )
}
export default func
func.tags = ["SOURCE"]
