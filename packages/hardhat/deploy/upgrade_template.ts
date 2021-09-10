// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { DeployFunction } from "hardhat-deploy/types"
// import { ethers } from "hardhat"
// import { ResourceTokenV2__factory } from "../../react-app/src/contracts/factories/ResourceTokenV2__factory"
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

//   const ResourceTokenV2 = await ethers.getContractFactory("ResourceTokenV2")
//   const ResourceTokenV2Abi = ResourceTokenV2__factory.abi

//   const proxy = await deployments.get("ResourceToken")
//   console.log(proxy.address)
//   const resourceToken = await upgrades.upgradeProxy(proxy.address, ResourceTokenV2)
//   await saveDeployment("ResourceTokenV2", deployments, resourceToken, ResourceTokenV2Abi)
// }
const func = () => {}
export default func
