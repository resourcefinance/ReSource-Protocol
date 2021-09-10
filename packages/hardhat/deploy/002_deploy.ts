// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { DeployFunction } from "hardhat-deploy/types"
// import { ethers } from "hardhat"
// import { MutualityTokenV2__factory } from "../../react-app/src/contracts/factories/MutualityTokenV2__factory"
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

//   const MutualityTokenV2 = await ethers.getContractFactory("MutualityTokenV2")
//   const MutualityTokenV2Abi = MutualityTokenV2__factory.abi

//   const proxy = await deployments.get("MutualityToken")
//   console.log(proxy.address)
//   const mutualityToken = await upgrades.upgradeProxy(proxy.address, MutualityTokenV2)
//   await saveDeployment("MutualityTokenV2", deployments, mutualityToken, MutualityTokenV2Abi)
// }
const func = () => {}
export default func
