import { DeploymentsExtension } from "hardhat-deploy/types"
import { Contract, ContractFactory, ethers } from "ethers"

const formatDeploymentReceipt = (deployTransaction) => {
  return {
    from: deployTransaction.from,
    transactionHash: deployTransaction.hash,
    blockHash: deployTransaction.blockHash,
    blockNumber: deployTransaction.blockNumber,
    transactionIndex: deployTransaction.transactionIndex,
    cumulativeGasUsed: deployTransaction.gasLimit,
    gasUsed: deployTransaction.gasPrice,
    confirmations: deployTransaction.confirmations,
  }
}

export const saveDeployment = async (
  name: string,
  deployments: DeploymentsExtension,
  deployment: Contract,
  abi,
) => {
  const networkRegistryDeployment = {
    address: deployment.address,
    abi,
    receipt: formatDeploymentReceipt(deployment.deployTransaction),
  }

  deployments.save(name, networkRegistryDeployment)
}
