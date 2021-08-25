import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;

  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  //deploy network registry
  const networkRegistryDeploy = await deploy("NetworkRegistry", {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        methodName: "initialize",
        args: [[], []]
      }
    },
  })

  const networkRegistryAddress = networkRegistryDeploy.address;

  // mutuality deploy 
  const mutualityTokenDeploy = await deploy("MutualityToken", {
    from: deployer,
    proxy: {
      owner: deployer,
      execute: {
        methodName: "initialize",
        args: [ethers.utils.parseEther("10000000")]
      }
    },
  })

  const mutualityTokenAddress = mutualityTokenDeploy.address;

  // underwriteManager deploy
  const underwriteManagerDeploy = await deploy("UnderwriteManager", {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        methodName: "initialize",
        args: [mutualityTokenAddress]
      }
    },
  })

  const underwriteManagerAddress = underwriteManagerDeploy.address;


  // // rUSD deploy
  await deploy("RUSD", {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: "OptimizedTransparentProxy",
      execute: {
        methodName: "initializeRUSD",
        args: [networkRegistryAddress, 7776000, underwriteManagerAddress]
      }
    },
  })

};
export default func;
