// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { DeployFunction } from "hardhat-deploy/types"
// import { ethers } from "hardhat"

// import { saveDeployment } from "../utils"

// const func: DeployFunction = async function({
//   getNamedAccounts,
//   deployments,
//   upgrades,
//   getChainId,
//   network,
// }: HardhatRuntimeEnvironment) {
//   const { deploy } = deployments

//   const { deployer } = await getNamedAccounts()

//   const ReSourceTokenV2 = await ethers.getContractFactory("ReSourceTokenV2")
//   const ReSourceTokenV2Abi = ReSourceTokenV2__factory.abi

//   const proxy = await deployments.get("ReSourceToken")
//   console.log(proxy.address)
//   const reSourceToken = await upgrades.upgradeProxy(proxy.address, ReSourceTokenV2)
//   await saveDeployment("ReSourceTokenV2", deployments, reSourceToken, ReSourceTokenV2Abi)
// }
const func = () => {}
export default func
