import { SourceToken } from "./../../oracle/src/contracts/types/SourceToken.d"
import { Contract } from "ethers"
import { deployments, getNamedAccounts, getChainId, ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function() {
  const { deployer } = await ethers.getNamedSigners()

  const deploy = await deployments.deploy("TokenPriceOracle", {
    from: deployer.address,
    args: [deployer.address],
  })
}

export default func

func.tags = ["Oracle"]
