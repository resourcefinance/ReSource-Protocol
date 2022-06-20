import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployments, upgrades, ethers } from "hardhat"
import { RestrictedCreditPoolV2__factory } from "../types"

const func: DeployFunction = async function (hardhat: HardhatRuntimeEnvironment) {
  const RestrictedCreditPoolV2Factory = await ethers.getContractFactory("RestrictedCreditPoolV2")
  const RestrictedCreditPoolV2Abi = RestrictedCreditPoolV2__factory.abi

  const proxy = await deployments.get("RestrictedCreditPool")
  let RestrictedCreditPoolV2

  try {
    RestrictedCreditPoolV2 = await upgrades.upgradeProxy(
      proxy.address,
      RestrictedCreditPoolV2Factory
    )
  } catch (e) {
    console.log(e)
  }

  const contractDeployment = {
    address: RestrictedCreditPoolV2.address,
    abi: RestrictedCreditPoolV2Abi,
    receipt: await RestrictedCreditPoolV2.deployTransaction.wait(),
  }

  hardhat.deployments.save("RestrictedCreditPoolV2", contractDeployment)
  console.log("🚀  CreditPool Upgraded to V2")
}

export default func

func.tags = ["creditPool-upgrade"]
