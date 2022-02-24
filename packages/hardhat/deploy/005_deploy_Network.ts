import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { ethers } from "hardhat"
import { CreditRoles__factory } from "../types/factories/CreditRoles__factory"
import { NetworkFeeManager__factory } from "../types/factories/NetworkFeeManager__factory"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
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

  // 1. deploy WalletDeployer
  const walletDeployerArgs = []
  const walletDeployerAbi = (await hardhat.artifacts.readArtifact("iKeyWalletDeployer")).abi
  const walletDeployerAddress = await deployProxyAndSave(
    "iKeyWalletDeployer",
    walletDeployerArgs,
    hardhat,
    walletDeployerAbi,
  )

  // 2. deploy NetworkRoles
  const networkRolesArgs = [[], walletDeployerAddress]
  const networkRolesAbi = (await hardhat.artifacts.readArtifact("NetworkRoles")).abi
  const networkRolesAddress = await deployProxyAndSave(
    "NetworkRoles",
    networkRolesArgs,
    hardhat,
    networkRolesAbi,
  )

  // 3. deploy NetworkFeeManager
  const networkFeeManagerArgs = [creditFeeManagerAddress, networkRolesAddress, 100000, 500000]
  const networkFeeManagerAbi = (await hardhat.artifacts.readArtifact("NetworkFeeManager")).abi
  const networkFeeManagerAddress = await deployProxyAndSave(
    "NetworkFeeManager",
    networkFeeManagerArgs,
    hardhat,
    networkFeeManagerAbi,
  )

  const networkFeeManager = NetworkFeeManager__factory.connect(
    networkFeeManagerAddress,
    accounts[0],
  )

  await (await creditRoles.grantNetwork(networkFeeManagerAddress)).wait()

  // 4. deploy RUSD
  const rUSDArgs = [creditManagerAddress, networkFeeManagerAddress, networkRolesAddress]
  const rUSDAbi = (await hardhat.artifacts.readArtifact("RUSDV3")).abi
  const rUSDAddress = await deployProxyAndSave("RUSDV3", rUSDArgs, hardhat, rUSDAbi, {
    initializer: "initializeRUSD",
  })

  await (await networkFeeManager.registerNetwork(rUSDAddress)).wait()
}
export default func
func.tags = ["NETWORK"]
