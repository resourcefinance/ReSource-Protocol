import { DeploymentsExtension } from "hardhat-deploy/types"
import { Contract, ContractFactory, ethers } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { retry } from "ts-retry"

export const formatDeploymentReceipt = (deployTransaction) => {
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

export const deployProxyAndSave = async (
  name: string,
  args: any[],
  hardhat: HardhatRuntimeEnvironment,
  abi,
  initializer?: {},
): Promise<Contract> => {
  const contractFactory = await hardhat.ethers.getContractFactory(name)

  let contract
  await retry(
    async () => {
      contract = await hardhat.upgrades.deployProxy(contractFactory, args, initializer)
    },
    { delay: 200, maxTry: 10 },
  )

  const contractDeployment = {
    address: contract.address,
    abi,
    receipt: formatDeploymentReceipt(contract.deployTransaction),
  }

  hardhat.deployments.save(name, contractDeployment)

  return contract
}
