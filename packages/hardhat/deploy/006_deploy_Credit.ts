import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { ethers } from "hardhat"
import { CreditRoles__factory } from "../types/factories/CreditRoles__factory"
import { PriceOracle__factory } from "../types/factories/PriceOracle__factory"
import { CreditManager__factory } from "../types/factories/CreditManager__factory"
import { CreditRequest__factory, PriceOracle } from "../types"

const func: DeployFunction = async function (hardhat: HardhatRuntimeEnvironment) {
  const accounts = await ethers.getSigners()

  let sourceTokenAddress = (await hardhat.deployments.getOrNull("SourceToken"))?.address

  if (!sourceTokenAddress) throw Error("SOURCE not deployed")

  // 1. deploy ProtocolRoles
  const creditRolesArgs = [[]]
  const creditRolesAbi = (await hardhat.artifacts.readArtifact("CreditRoles")).abi
  const creditRolesAddress = await deployProxyAndSave(
    "CreditRoles",
    creditRolesArgs,
    hardhat,
    creditRolesAbi
  )
  const creditRoles = CreditRoles__factory.connect(creditRolesAddress, accounts[0])

  // 2. deploy PriceOracle
  const priceOracleFactory = await ethers.getContractFactory("PriceOracle")
  const priceOracle = await hardhat.deployments.deploy("PriceOracle", {
    args: [1000],
    from: accounts[0].address,
  })

  // 3. deploy CreditManager
  const creditManagerArgs = [sourceTokenAddress, creditRoles.address, priceOracle.address]
  const creditManagerAbi = (await hardhat.artifacts.readArtifact("CreditManager")).abi
  const creditManagerAddress = await deployProxyAndSave(
    "CreditManager",
    creditManagerArgs,
    hardhat,
    creditManagerAbi
  )
  const creditManager = CreditManager__factory.connect(creditManagerAddress, accounts[0])

  // 4. deploy CreditRequest
  const creditRequestArgs = [creditRoles.address, creditManager.address]
  const creditRequestAbi = (await hardhat.artifacts.readArtifact("CreditRequest")).abi
  const creditRequestAddress = await deployProxyAndSave(
    "CreditRequest",
    creditRequestArgs,
    hardhat,
    creditRequestAbi
  )
  const creditRequest = CreditRequest__factory.connect(creditRequestAddress, accounts[0])

  creditRoles.grantOperator(creditRequest.address)

  // 5. deploy CreditFeeManager
  const creditFeeManagerArgs = [
    creditManager.address,
    creditRoles.address,
    creditRequest.address,
    100000,
  ]
  const creditFeeManagerAbi = (await hardhat.artifacts.readArtifact("CreditFeeManager")).abi
  await deployProxyAndSave("CreditFeeManager", creditFeeManagerArgs, hardhat, creditFeeManagerAbi)

  // 6. deploy a CreditPool
  const creditPoolArgs = [creditManager.address, creditRoles.address, accounts[0].address]
  const creditPoolAbi = (await hardhat.artifacts.readArtifact("CreditPool")).abi
  const creditPoolAddress = await deployProxyAndSave(
    "CreditPool",
    creditPoolArgs,
    hardhat,
    creditPoolAbi
  )

  await (await creditManager.registerCreditPool(creditPoolAddress)).wait()
  await (await creditRoles.grantOperator(creditManagerAddress)).wait()
}
export default func
func.tags = ["CREDIT"]
