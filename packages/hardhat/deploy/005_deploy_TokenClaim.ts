import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployProxyAndSave } from "../utils/utils"
import { deployments, ethers } from "hardhat"

const func: DeployFunction = async function(hardhat: HardhatRuntimeEnvironment) {
  let sourceTokenAddress = (await hardhat.deployments.getOrNull("SourceToken"))?.address
  if (!sourceTokenAddress) throw Error("SOURCE not deployed")

  // tokenClaim deploy
  const tokenClaimAbi = (await hardhat.artifacts.readArtifact("TokenClaim")).abi
  const tokenClaimArgs = [sourceTokenAddress]

  const tokenClaimAddress = await deployProxyAndSave(
    "TokenClaim",
    tokenClaimArgs,
    hardhat,
    tokenClaimAbi,
  )
}
export default func
func.tags = ["CLAIM"]
