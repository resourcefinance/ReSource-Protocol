import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployments, ethers, upgrades } from "hardhat"
import { TokenClaim__factory } from "../types/factories/TokenClaim__factory"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  const TokenClaimV2 = await ethers.getContractFactory("TokenClaimV2")
  const TokenClaimV2Abi = TokenClaim__factory.abi

  const proxy = await deployments.get("TokenClaim")
  let tokenClaimV2
  try {
    tokenClaimV2 = await upgrades.upgradeProxy(proxy.address, TokenClaimV2)
  } catch (e) {
    console.log(e)
  }
  const contractDeployment = {
    address: tokenClaimV2.address,
    abi: TokenClaimV2Abi,
    receipt: await tokenClaimV2.deployTransaction.wait(),
  }

  hardhat.deployments.save("TokenClaimV2", contractDeployment)
  console.log("🚀  TokenClaim Upgraded ")
}
export default func
func.tags = ["CLAIM-upgrade"]
