import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, upgrades, ethers } from "hardhat"
import { SourceTokenV2__factory } from "../types/factories/SourceTokenV2__factory"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const ReSourceTokenV2 = await ethers.getContractFactory("SourceTokenV2")
  const ReSourceTokenV2Abi = SourceTokenV2__factory.abi

  const proxy = await deployments.get("SourceToken")
  let sourceTokenV2
  try {
    sourceTokenV2 = await upgrades.upgradeProxy(proxy.address, ReSourceTokenV2, {
      call: "upgradeV2",
    })
  } catch (e) {
    console.log(e)
  }
  const contractDeployment = {
    address: sourceTokenV2.address,
    abi: ReSourceTokenV2Abi,
    receipt: await sourceTokenV2.deployTransaction.wait(),
  }

  hardhat.deployments.save("SourceTokenV2", contractDeployment)
  console.log("🚀  Source Upgraded ")
}
export default func
func.tags = ["SOURCE-upgrade"]
