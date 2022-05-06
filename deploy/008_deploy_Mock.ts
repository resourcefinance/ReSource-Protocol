import { parseEther } from "ethers/lib/utils"
import { deployments } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hardhat: HardhatRuntimeEnvironment) {
  // hardhat-deploy takes care of saving deployment artifact
  const vesting = await deployments.deploy("MockERC20", {
    from: (await hardhat.ethers.getSigners())[0].address,
    args: [parseEther("100000000")],
  })

  console.log(
    `${!vesting.newlyDeployed ? "✅ MockERC20 already deployed" : "🚀  MockERC20 deployed"}`
  )
}

export default func
func.tags = ["MockERC20"]
