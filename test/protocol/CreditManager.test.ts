import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { protocolFactory, ProtocolContracts } from "./protocolFactory"

chai.use(solidity)

describe("CreditRequest and CreditManager Tests", function () {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let requestOpperator: SignerWithAddress
  let member: SignerWithAddress

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.RSD.address)).wait()
  })

  it("Create, approve, and accept a new credit request as operator", async function () {
    await (await contracts.creditRoles.grantRequestOperator(underwriter.address)).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .createRequest(
          contracts.RSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )

    expect(poolCreditLimit).to.equal("100.0")
    expect(creditLimit).to.equal("100.0")
  })

  it("Update and accept a request", async function () {
    await (await contracts.creditRoles.grantRequestOperator(underwriter.address)).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .createRequest(
          contracts.RSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .updateRequestLimit(
          contracts.RSD.address,
          member.address,
          ethers.utils.parseUnits("150", "mwei"),
          true
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )
    expect(poolCreditLimit).to.equal("150.0")
    expect(creditLimit).to.equal("150.0")
  })

  it("Create request as member approve as request operator and accept as underwriter", async function () {
    await (await contracts.creditRoles.grantRequestOperator(requestOpperator.address)).wait()

    await (
      await contracts.creditRequest
        .connect(member)
        .createRequest(
          contracts.RSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(requestOpperator)
        .approveRequest(contracts.RSD.address, member.address)
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )

    expect(poolCreditLimit).to.equal("100.0")
    expect(creditLimit).to.equal("100.0")
  })
  it("converts RSD amount to SOURCE value", async function () {
    // SOURCE at $0.50
    await (await contracts.priceOracle.setPrice(500)).wait()

    let collateralValue = ethers.utils.formatEther(
      await contracts.creditManager.convertNetworkToCollateral(
        contracts.RSD.address,
        ethers.utils.parseUnits("1000.0", "mwei")
      )
    )
    expect(collateralValue).to.equal("2000.0")

    // SOURCE at $1.50
    await (await contracts.priceOracle.setPrice(1500)).wait()
    collateralValue = Number(
      ethers.utils.formatEther(
        await contracts.creditManager.convertNetworkToCollateral(
          contracts.RSD.address,
          ethers.utils.parseUnits("1000.0", "mwei")
        )
      )
    ).toFixed(2)
    expect(collateralValue).to.equal("666.67")
  })
})
