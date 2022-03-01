import { upgrades, ethers, network } from "hardhat"
import {
  CreditPool,
  CreditRequest,
  CreditRoles,
  PriceOracle,
  SourceToken,
  CreditManager,
  NetworkFeeManager,
  CreditFeeManager,
  IKeyWalletDeployer,
  NetworkRoles,
  RUSDV3,
  SourceTokenV2,
  SourceTokenV2__factory,
} from "../../types"

export interface ProtocolContracts {
  creditRoles: CreditRoles
  sourceToken: SourceTokenV2
  priceOracle: PriceOracle
  creditManager: CreditManager
  creditRequest: CreditRequest
  walletDeployer: IKeyWalletDeployer
  networkFeeManager: NetworkFeeManager
  creditFeeManager: CreditFeeManager
  networkRoles: NetworkRoles
  rUSD: RUSDV3
  creditPool: CreditPool
}

export const protocolFactory = {
  deployDefault: async (underwriterAddress: string) => {
    contracts = {} as ProtocolContracts
    var contracts = contracts as ProtocolContracts
    // 1. deploy ProtocolRoles
    const creditRolesFactory = await ethers.getContractFactory("CreditRoles")
    contracts.creditRoles = (await upgrades.deployProxy(creditRolesFactory, [[]])) as CreditRoles

    // 2. deploy walletDeployer
    const walletDeployerFactory = await ethers.getContractFactory("iKeyWalletDeployer")
    contracts.walletDeployer = (await upgrades.deployProxy(
      walletDeployerFactory,
      [],
    )) as IKeyWalletDeployer

    // 3. deploy NetworkRoles
    const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")
    contracts.networkRoles = (await upgrades.deployProxy(networkRolesFactory, [
      [],
      contracts.walletDeployer.address,
    ])) as NetworkRoles

    // 4. deploy & upgrade SOURCE
    const SOURCEFactory = await ethers.getContractFactory("SourceToken")
    const sourceToken = (await upgrades.deployProxy(SOURCEFactory, [
      ethers.utils.parseEther("100000000"),
      [],
    ])) as SourceToken
    const SourceTokenV2 = await ethers.getContractFactory("SourceTokenV2")

    contracts.sourceToken = (await upgrades.upgradeProxy(sourceToken.address, SourceTokenV2, {
      call: "upgradeV2",
    })) as SourceTokenV2

    // 5. deploy PriceOracle
    const priceOracleFactory = await ethers.getContractFactory("PriceOracle")
    contracts.priceOracle = (await priceOracleFactory.deploy(
      ethers.utils.parseEther("1"),
    )) as PriceOracle

    // 6. deploy CreditManager
    const creditManagerFactory = await ethers.getContractFactory("CreditManager")
    contracts.creditManager = (await upgrades.deployProxy(creditManagerFactory, [
      contracts.sourceToken.address,
      contracts.creditRoles.address,
      contracts.priceOracle.address,
    ])) as CreditManager
    await (await contracts.creditRoles.grantOperator(contracts.creditManager.address)).wait()

    // 7. deploy CreditRequest
    const creditRequestFactory = await ethers.getContractFactory("CreditRequest")
    contracts.creditRequest = (await upgrades.deployProxy(creditRequestFactory, [
      contracts.creditRoles.address,
      contracts.creditManager.address,
    ])) as CreditRequest
    await (await contracts.creditRoles.grantOperator(contracts.creditRequest.address)).wait()

    // 8. deploy UnderwriteFeeManager
    const creditFeeManagerFactory = await ethers.getContractFactory("CreditFeeManager")
    contracts.creditFeeManager = (await upgrades.deployProxy(creditFeeManagerFactory, [
      contracts.priceOracle.address,
      contracts.creditManager.address,
      contracts.creditRoles.address,
      contracts.creditRequest.address,
      100000,
    ])) as CreditFeeManager
    await (await contracts.creditRoles.grantOperator(contracts.creditFeeManager.address)).wait()

    // 9. deploy NetworkFeeManager
    const networkFeeManagerFactory = await ethers.getContractFactory("NetworkFeeManager")
    contracts.networkFeeManager = (await upgrades.deployProxy(networkFeeManagerFactory, [
      contracts.creditFeeManager.address,
      contracts.networkRoles.address,
      100000,
      500000,
    ])) as NetworkFeeManager

    await (await contracts.creditRoles.grantNetwork(contracts.networkFeeManager.address)).wait()

    // 10. deploy RUSD
    const RUSDFactory = await ethers.getContractFactory("RUSDV3")
    contracts.rUSD = (await upgrades.deployProxy(
      RUSDFactory,
      [
        contracts.creditManager.address,
        contracts.networkFeeManager.address,
        contracts.networkRoles.address,
      ],
      {
        initializer: "initializeRUSD",
      },
    )) as RUSDV3

    await (await contracts.networkFeeManager.registerNetwork(contracts.rUSD.address)).wait()

    // 11. deploy a CreditPool
    const creditPoolFactory = await ethers.getContractFactory("CreditPool")
    contracts.creditPool = (await upgrades.deployProxy(creditPoolFactory, [
      contracts.creditManager.address,
      contracts.creditRoles.address,
      underwriterAddress,
    ])) as CreditPool
    await (await contracts.creditRoles.grantUnderwriter(underwriterAddress)).wait()

    await (await contracts.creditManager.registerCreditPool(contracts.creditPool.address)).wait()

    return contracts
  },
}
