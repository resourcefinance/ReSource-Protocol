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
  let ambassador: SignerWithAddress
  let member: SignerWithAddress

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    ambassador = accounts[4]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.rUSD.address)).wait()
  })

  it("Create, approve, and accept a new credit request as operator", async function () {
    await (await contracts.creditRoles.grantRequestOperator(underwriter.address)).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .createRequest(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
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
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .updateRequestLimit(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("150", "mwei"),
          true
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
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
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(requestOpperator)
        .approveRequest(contracts.rUSD.address, member.address)
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )

    expect(poolCreditLimit).to.equal("100.0")
    expect(creditLimit).to.equal("100.0")
  })
})
