import { upgrades, ethers, network } from "hardhat"
import {
  CreditRequest,
  ProtocolRoles,
  PriceOracle,
  SourceToken,
  CreditManager,
  NetworkFeeManager,
  UnderwriteFeeManager,
  IKeyWalletDeployer,
  NetworkRoles,
  RUSDV3,
} from "../../types"

export interface ProtocolContracts {
  protocolRoles: ProtocolRoles
  sourceToken: SourceToken
  priceOracle: PriceOracle
  creditManager: CreditManager
  creditRequest: CreditRequest
  walletDeployer: IKeyWalletDeployer
  networkFeeManager: NetworkFeeManager
  underwriteFeeManager: UnderwriteFeeManager
  networkRoles: NetworkRoles
  rUSD: RUSDV3
}

export const deployPrtotocolAndNetwork = async () => {
  global.contracts = {} as ProtocolContracts
  var contracts = global.contracts
  // 1. deploy ProtocolRoles
  const protocolRolesFactory = await ethers.getContractFactory("ProtocolRoles")
  contracts.protocolRoles = (await upgrades.deployProxy(protocolRolesFactory, [
    [],
    "0x0000000000000000000000000000000000000000",
  ])) as ProtocolRoles

  // 2. deploy NetworkRoles
  const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")
  contracts.networkRegistry = (await upgrades.deployProxy(networkRolesFactory, [
    [],
    contracts.walletDeployer.address,
  ])) as NetworkRoles

  // 3. deploy SOURCE
  const SOURCEFactory = await ethers.getContractFactory("SourceToken")
  contracts.sourceToken = (await upgrades.deployProxy(SOURCEFactory, [
    ethers.utils.parseEther("100000000"),
    [],
  ])) as SourceToken

  // 4. deploy PriceOracle
  const priceOracleFactory = await ethers.getContractFactory("PriceOracle")
  contracts.priceOracle = (await priceOracleFactory.deploy(
    ethers.utils.parseEther("1"),
  )) as PriceOracle

  // 5. deploy CreditManager
  const creditManagerFactory = await ethers.getContractFactory("CreditManager")
  contracts.creditManager = (await upgrades.deployProxy(creditManagerFactory, [
    contracts.sourceToken.address,
    contracts.protocolRoles.address,
    contracts.priceOracle.address,
  ])) as CreditManager

  // 6. deploy CreditRequest
  const creditRequestFactory = await ethers.getContractFactory("CreditRequest")
  contracts.creditRequest = (await upgrades.deployProxy(creditRequestFactory, [
    contracts.protocolRoles.address,
    contracts.underwriteManager.address,
  ])) as CreditRequest

  // 7. deploy walletDeployer
  const walletDeployerFactory = await ethers.getContractFactory("iKeyWalletDeployer")
  contracts.walletDeployer = (await upgrades.deployProxy(
    walletDeployerFactory,
    [],
  )) as IKeyWalletDeployer

  // 8. deploy UnderwriteFeeManager
  const underwriteFeeManagerFactory = await ethers.getContractFactory("UnderwriteFeeManager")
  contracts.underwriteFeeManager = (await upgrades.deployProxy(underwriteFeeManagerFactory, [
    contracts.sourceToken.address,
    contracts.priceOracle.address,
    contracts.underwriteManager.address,
    contracts.protocolRoles.address,
  ])) as UnderwriteFeeManager

  // 9. deploy NetworkFeeManager
  const networkFeeManagerFactory = await ethers.getContractFactory("NetworkFeeManager")
  contracts.networkFeeManager = (await upgrades.deployProxy(networkFeeManagerFactory, [
    contracts.underwriteFeeManager.address,
    200000,
    0,
  ])) as NetworkFeeManager

  // 10. deploy RUSD
  const RUSDFactory = await ethers.getContractFactory("RUSDV3")
  contracts.rUSD = (await upgrades.deployProxy(
    RUSDFactory,
    [
      contracts.underwriteManager.address,
      contracts.feeManager.address,
      contracts.networkRegistry.address,
      contracts.protocolRoles.address,
    ],
    {
      initializer: "initializeRUSD",
    },
  )) as RUSDV3

  return global.contracts
}
