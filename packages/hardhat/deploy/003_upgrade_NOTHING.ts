import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployments, upgrades, ethers } from "hardhat"
import { NothingToken, NothingTokenV2__factory } from "../types"
import { NothingToken__factory } from "../types/factories/NothingToken__factory"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const NothingTokenV2 = await ethers.getContractFactory("NothingTokenV2")
  const NothingTokenV2Abi = NothingTokenV2__factory.abi

  const proxy = await deployments.get("NothingToken")

  let nothingTokenV2
  try {
    nothingTokenV2 = await upgrades.upgradeProxy(proxy.address, NothingTokenV2, {
      call: "upgradeV2",
    })
  } catch (e) {
    console.log(e)
  }

  const contractDeployment = {
    address: nothingTokenV2.address,
    abi: NothingTokenV2Abi,
    receipt: await nothingTokenV2.deployTransaction.wait(),
  }

  hardhat.deployments.save("NothingTokenV2", contractDeployment)
  console.log("🚀  Nothing Upgraded ")
}
export default func
func.tags = ["NOTHING-upgrade"]
