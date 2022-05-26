import { upgrades, ethers, network } from "hardhat"
import { SourceTokenV3 } from "../../types/SourceTokenV3"
import { RestrictedCreditPool } from "../../types/RestrictedCreditPool"
import {
  CreditPool,
  CreditRequest,
  CreditRoles,
  PriceOracle,
  SourceToken,
  CreditManager,
  CreditFeeManager,
  NetworkRoles,
  RSD,
  MinimalForwarder,
} from "../../types"

export interface ProtocolContracts {
  creditRoles: CreditRoles
  sourceToken: SourceTokenV3
  priceOracle: PriceOracle
  creditManager: CreditManager
  creditRequest: CreditRequest
  creditFeeManager: CreditFeeManager
  networkRoles: NetworkRoles
  minimalForwarder: MinimalForwarder
  RSD: RSD
  creditPool: RestrictedCreditPool
}

export const protocolFactory = {
  deployDefault: async (underwriterAddress: string) => {
    contracts = {} as ProtocolContracts
    const accounts = await ethers.getSigners()
    var contracts = contracts as ProtocolContracts
    // 1. deploy ProtocolRoles
    const creditRolesFactory = await ethers.getContractFactory("CreditRoles")
    contracts.creditRoles = (await upgrades.deployProxy(creditRolesFactory, [[]])) as CreditRoles

    // 2. deploy NetworkRoles
    const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")
    contracts.networkRoles = (await upgrades.deployProxy(networkRolesFactory, [[]])) as NetworkRoles

    await (await contracts.networkRoles.grantOperator(contracts.networkRoles.address)).wait()

    // 4. deploy & upgrade SOURCE
    const SOURCEFactory = await ethers.getContractFactory("SourceToken")
    const sourceToken = (await upgrades.deployProxy(SOURCEFactory, [
      ethers.utils.parseEther("100000000"),
      [],
    ])) as SourceToken
    const SourceTokenV2 = await ethers.getContractFactory("SourceTokenV2")
    await upgrades.upgradeProxy(sourceToken.address, SourceTokenV2, {
      call: "upgradeV2",
    })

    const SourceTokenV3 = await ethers.getContractFactory("SourceTokenV3")
    contracts.sourceToken = (await upgrades.upgradeProxy(
      sourceToken.address,
      SourceTokenV3
    )) as SourceTokenV3

    // 5. deploy PriceOracle
    const priceOracleFactory = await ethers.getContractFactory("PriceOracle")
    contracts.priceOracle = (await priceOracleFactory.deploy(
      1000,
      accounts[0].address
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
      contracts.creditManager.address,
      contracts.creditRoles.address,
      contracts.creditRequest.address,
      100000,
    ])) as CreditFeeManager
    await (await contracts.creditRoles.grantOperator(contracts.creditFeeManager.address)).wait()

    // 9. deploy
    const minimalForwarderFactory = await ethers.getContractFactory("MinimalForwarder")
    contracts.minimalForwarder = (await minimalForwarderFactory.deploy()) as MinimalForwarder

    // 9. deploy RSD
    const RSDFactory = await ethers.getContractFactory("RSD")
    contracts.RSD = (await upgrades.deployProxy(
      RSDFactory,
      [
        contracts.creditRoles.address,
        contracts.creditFeeManager.address,
        contracts.networkRoles.address,
        contracts.minimalForwarder.address,
      ],
      {
        initializer: "initializeRSD",
      }
    )) as RSD

    await (await contracts.RSD.unpause()).wait()
    await (await contracts.networkRoles.setNetwork(contracts.RSD.address)).wait()
    await (await contracts.networkRoles.grantOperator(contracts.RSD.address)).wait()
    await (await contracts.networkRoles.grantMember(contracts.RSD.address)).wait()

    // 10. deploy a CreditPool
    const creditPoolFactory = await ethers.getContractFactory("RestrictedCreditPool")
    contracts.creditPool = (await upgrades.deployProxy(creditPoolFactory, [
      contracts.creditManager.address,
      contracts.creditRoles.address,
      underwriterAddress,
    ])) as RestrictedCreditPool
    await (await contracts.creditRoles.grantUnderwriter(underwriterAddress)).wait()

    await (await contracts.creditFeeManager.approveCreditPool(contracts.creditPool.address)).wait()

    await (await contracts.creditManager.registerCreditPool(contracts.creditPool.address)).wait()

    await (
      await contracts.creditPool.addReward(
        contracts.sourceToken.address,
        accounts[0].address,
        7776000
      )
    ).wait()

    return contracts
  },
}
