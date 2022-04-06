import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("Protocol Tests", function () {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    memberC = accounts[3]
    underwriter = accounts[4]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.rUSD.pause()).wait()
  })

  it("migrate memberA", async function () {
    await (await contracts.rUSD.initializeMigration(ethers.utils.parseUnits("1000", "mwei"))).wait()

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    await (
      await contracts.rUSD.migrateAccount(
        memberA.address,
        ethers.utils.parseUnits("50", "mwei"),
        0,
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberA.address), "mwei")
    ).to.equal("50.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("950.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberA.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberA.address), "mwei")
    ).to.equal("0.0")

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")
  })

  it("migrate memberA, memberB, and memberC", async function () {
    await (await contracts.rUSD.initializeMigration(ethers.utils.parseUnits("1000", "mwei"))).wait()

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    await (
      await contracts.rUSD.migrateAccount(
        memberA.address,
        ethers.utils.parseUnits("50", "mwei"),
        0,
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberB.address,
        0,
        ethers.utils.parseUnits("250", "mwei"),
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberC.address,
        ethers.utils.parseUnits("100", "mwei"),
        0,
        0
      )
    ).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberA.address), "mwei")
    ).to.equal("50.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberA.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberA.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberB.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberB.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberB.address), "mwei")
    ).to.equal("250.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberC.address), "mwei")
    ).to.equal("100.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("850.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("750.0")

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")
  })

  it("migrate memberA, memberB, and memberC and close out the rest", async function () {
    await (await contracts.rUSD.initializeMigration(ethers.utils.parseUnits("1000", "mwei"))).wait()

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    await (
      await contracts.rUSD.migrateAccount(
        memberA.address,
        ethers.utils.parseUnits("50", "mwei"),
        0,
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberB.address,
        0,
        ethers.utils.parseUnits("250", "mwei"),
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberC.address,
        ethers.utils.parseUnits("100", "mwei"),
        0,
        0
      )
    ).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberA.address), "mwei")
    ).to.equal("50.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberA.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberA.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberB.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberB.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberB.address), "mwei")
    ).to.equal("250.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberC.address), "mwei")
    ).to.equal("100.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("850.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("750.0")

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(deployer.address), "mwei")
    ).to.equal("0.0")

    await (await contracts.rUSD.recoverUnmigrated()).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(deployer.address), "mwei")
    ).to.equal("850.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("750.0")

    await (
      await contracts.rUSD.transfer(
        contracts.rUSD.address,
        await contracts.rUSD.creditBalanceOf(contracts.rUSD.address)
      )
    ).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(deployer.address), "mwei")
    ).to.equal("100.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("0.0")
  })

  it("migrate memberA, memberB, and memberC with all credit and balance", async function () {
    await (await contracts.rUSD.initializeMigration(ethers.utils.parseUnits("1000", "mwei"))).wait()

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    await (
      await contracts.rUSD.migrateAccount(
        memberA.address,
        ethers.utils.parseUnits("500", "mwei"),
        0,
        ethers.utils.parseUnits("500", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberB.address,
        0,
        ethers.utils.parseUnits("1000", "mwei"),
        ethers.utils.parseUnits("1000", "mwei")
      )
    ).wait()

    await (
      await contracts.rUSD.migrateAccount(
        memberC.address,
        ethers.utils.parseUnits("500", "mwei"),
        0,
        0
      )
    ).wait()

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberA.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberA.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberA.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberB.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberB.address), "mwei")
    ).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberB.address), "mwei")
    ).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(memberC.address), "mwei")
    ).to.equal("500.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(memberC.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("0.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditLimitOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("0.0")

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.balanceOf(deployer.address), "mwei")
    ).to.equal("0.0")
  })

  it("reverted with invalid migration data", async function () {
    await (await contracts.rUSD.initializeMigration(ethers.utils.parseUnits("1000", "mwei"))).wait()

    expect(ethers.utils.formatUnits(await contracts.rUSD.totalSupply(), "mwei")).to.equal("1000.0")

    expect(
      ethers.utils.formatUnits(await contracts.rUSD.creditBalanceOf(contracts.rUSD.address), "mwei")
    ).to.equal("1000.0")

    await expect(
      contracts.rUSD.migrateAccount(
        memberA.address,
        0,
        ethers.utils.parseUnits("1000", "mwei"),
        ethers.utils.parseUnits("999", "mwei")
      )
    ).to.be.reverted

    await expect(
      contracts.rUSD.migrateAccount(
        memberA.address,
        0,
        ethers.utils.parseUnits("1001", "mwei"),
        ethers.utils.parseUnits("1001", "mwei")
      )
    ).to.be.reverted

    await expect(
      contracts.rUSD.migrateAccount(memberA.address, ethers.utils.parseUnits("1001", "mwei"), 0, 0)
    ).to.be.reverted
  })
})
