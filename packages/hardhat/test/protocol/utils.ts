import { upgrades, ethers, network } from "hardhat"
import {
  CreditRequest,
  ProtocolRoles,
  PriceOracle,
  SourceToken,
  UnderwriteManagerV3,
  FeeManager,
  IKeyWalletDeployer,
  NetworkRegistryV3,
  RUSDV3,
} from "../../types"

export interface ProtocolContracts {
  protocolRoles: ProtocolRoles
  sourceToken: SourceToken
  priceOracle: PriceOracle
  underwriteManager: UnderwriteManagerV3
  creditRequest: CreditRequest
  walletDeployer: IKeyWalletDeployer
  feeManager: FeeManager
  networkRegistry: NetworkRegistryV3
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
  // 2. deploy SOURCE
  const SOURCEFactory = await ethers.getContractFactory("SourceToken")
  contracts.sourceToken = (await upgrades.deployProxy(SOURCEFactory, [
    ethers.utils.parseEther("100000000"),
    [],
  ])) as SourceToken

  // // 3. deploy PriceOracle
  const priceOracleFactory = await ethers.getContractFactory("PriceOracle")
  contracts.priceOracle = (await priceOracleFactory.deploy(
    ethers.utils.parseEther("1"),
  )) as PriceOracle

  // // 4. deploy UnderwriteManager
  const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManagerV3")
  contracts.underwriteManager = (await upgrades.deployProxy(underwriteManagerFactory, [
    contracts.sourceToken.address,
    contracts.protocolRoles.address,
    contracts.priceOracle.address,
  ])) as UnderwriteManagerV3

  // // 5. deploy CreditRequest
  const creditRequestFactory = await ethers.getContractFactory("CreditRequest")
  contracts.creditRequest = (await upgrades.deployProxy(creditRequestFactory, [
    contracts.protocolRoles.address,
    contracts.underwriteManager.address,
  ])) as CreditRequest

  // // 6. deploy walletDeployer
  const walletDeployerFactory = await ethers.getContractFactory("iKeyWalletDeployer")
  contracts.walletDeployer = (await upgrades.deployProxy(
    walletDeployerFactory,
    [],
  )) as IKeyWalletDeployer

  // // 7. deploy FeeManager
  const feeManagerFactory = await ethers.getContractFactory("FeeManager")
  contracts.feeManager = (await upgrades.deployProxy(feeManagerFactory, [
    contracts.sourceToken.address,
    contracts.priceOracle.address,
    contracts.underwriteManager.address,
    contracts.protocolRoles.address,
  ])) as FeeManager

  // // 8. deploy NetworkRegistry
  const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistryV3")
  contracts.networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
    contracts.protocolRoles.address,
    contracts.walletDeployer.address,
  ])) as NetworkRegistryV3

  // // 9. deploy RUSD
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
