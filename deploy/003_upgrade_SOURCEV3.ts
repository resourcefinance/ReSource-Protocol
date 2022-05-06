import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, upgrades, ethers } from "hardhat"
import { SourceTokenV3__factory } from "../types/factories/SourceTokenV3__factory"

const func: DeployFunction = async function (hardhat: HardhatRuntimeEnvironment) {
  const ReSourceTokenV3 = await ethers.getContractFactory("SourceTokenV3")
  const ReSourceTokenV3Abi = SourceTokenV3__factory.abi

  const proxy = await deployments.get("SourceToken")
  let sourceTokenV3

  try {
    sourceTokenV3 = await upgrades.upgradeProxy(proxy.address, ReSourceTokenV3)
  } catch (e) {
    console.log(e)
  }

  const contractDeployment = {
    address: sourceTokenV3.address,
    abi: ReSourceTokenV3Abi,
    receipt: await sourceTokenV3.deployTransaction.wait(),
  }

  hardhat.deployments.save("SourceTokenV3", contractDeployment)
  console.log("🚀  Source Upgraded to V3")
}

export default func

func.tags = ["SOURCE-upgrade-3"]
