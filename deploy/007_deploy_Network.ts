import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { ethers } from "hardhat"
import { CreditRoles__factory } from "../types/factories/CreditRoles__factory"
import { NetworkRoles__factory } from "../types/factories/NetworkRoles__factory"

const func: DeployFunction = async function (hardhat: HardhatRuntimeEnvironment) {
  const accounts = await ethers.getSigners()

  let sourceTokenAddress = (await hardhat.deployments.getOrNull("SourceToken"))?.address
  let creditFeeManagerAddress = (await hardhat.deployments.getOrNull("CreditFeeManager"))?.address
  let creditRolesAddress = (await hardhat.deployments.getOrNull("CreditRoles"))?.address
  let creditManagerAddress = (await hardhat.deployments.getOrNull("CreditManager"))?.address

  if (!sourceTokenAddress) throw Error("SOURCE not deployed")
  if (!creditFeeManagerAddress) throw Error("CreditFeeManager not deployed")
  if (!creditRolesAddress) throw Error("CreditRoles not deployed")
  if (!creditManagerAddress) throw Error("CreditManager not deployed")

  const creditRoles = CreditRoles__factory.connect(creditRolesAddress, accounts[0])

  // 1. deploy NetworkRoles
  const networkRolesArgs = [[]]
  const networkRolesAbi = (await hardhat.artifacts.readArtifact("NetworkRoles")).abi
  const networkRolesAddress = await deployProxyAndSave(
    "NetworkRoles",
    networkRolesArgs,
    hardhat,
    networkRolesAbi
  )

  const networkRoles = NetworkRoles__factory.connect(networkRolesAddress, accounts[0])

  // 2. deploy forwarder
  const minimalForwarder = await hardhat.deployments.deploy("MinimalForwarder", {
    args: [],
    from: accounts[0].address,
  })

  console.log("🚀  Forwarder deployed")

  // 3. deploy RUSD
  const rUSDArgs = [
    creditRolesAddress,
    creditFeeManagerAddress,
    networkRolesAddress,
    minimalForwarder.address,
  ]
  const rUSDAbi = (await hardhat.artifacts.readArtifact("RUSD")).abi
  const rUSDAddress = await deployProxyAndSave("RUSD", rUSDArgs, hardhat, rUSDAbi, {
    initializer: "initializeRUSD",
  })

  await (await networkRoles.setNetwork(rUSDAddress)).wait()
  await (await networkRoles.grantOperator(rUSDAddress)).wait()
  await (await creditRoles.grantNetwork(rUSDAddress)).wait()
}
export default func
func.tags = ["NETWORK"]
