import { DeploymentsExtension } from "hardhat-deploy/types"
import { Contract, ContractFactory, ethers } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { retry } from "ts-retry"

export const deployProxyAndSave = async (
  name: string,
  args: any[],
  hardhat: HardhatRuntimeEnvironment,
  abi,
  initializer?: {},
): Promise<Contract> => {
  const contractFactory = await hardhat.ethers.getContractFactory(name)
  contractFactory.signer

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
    receipt: await contract.deployTransaction.wait(),
  }

  hardhat.deployments.save(name, contractDeployment)

  return contract
}
