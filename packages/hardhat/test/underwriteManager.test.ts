import { ethers, upgrades, getNamedAccounts } from "hardhat"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { RUSD } from "../types/RUSD"
import { NetworkRegistry } from "../types/NetworkRegistry"
import { ReSourceToken } from "../types/ReSourceToken"
import { UnderwriteManager } from "../types/UnderwriteManager"
import { UnderwriteManager__factory } from "../types/factories/UnderwriteManager__factory"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
chai.use(solidity)

describe("UnderwriteManager Tests", function() {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress
  let operatorA: SignerWithAddress
  let underwriterA: SignerWithAddress
  let underwriterB: SignerWithAddress
  let rUSD: RUSD
  let reSourceToken: ReSourceToken
  let networkRegistry: NetworkRegistry
  let underwriteManager: UnderwriteManager

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    memberC = accounts[3]
    underwriterA = accounts[4]
    underwriterB = accounts[5]
    operatorA = accounts[6]
  })

  it("Successfully deploys a RUSD contract", async function() {
    const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")

    networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
      [memberA.address, memberB.address, memberC.address],
      [operatorA.address],
      deployer.address,
    ])) as NetworkRegistry

    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")

    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
    ])) as ReSourceToken

    const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")

    underwriteManager = (await upgrades.deployProxy(underwriteManagerFactory, [
      reSourceToken.address,
    ])) as UnderwriteManager

    const rUSDFactory = await ethers.getContractFactory("RUSD")

    rUSD = (await upgrades.deployProxy(
      rUSDFactory,
      [networkRegistry.address, 7, underwriteManager.address, deployer.address],
      {
        initializer: "initializeRUSD",
      },
    )) as RUSD

    const registryAddress = await rUSD.registry()
    const restrictionState = await rUSD.restrictionState()

    expect(restrictionState).to.equal(0)
    expect(rUSD.address).to.properAddress
    expect(registryAddress).to.properAddress
    expect(underwriteManager.address).to.properAddress
  })

  it("Send 100,000 mu to underwriterA", async function() {
    await expect(
      reSourceToken.transfer(underwriterA.address, ethers.utils.parseEther("100000")),
    ).to.emit(reSourceToken, "Transfer")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(underwriterA.address))).to.equal(
      "100000.0",
    )
  })

  it("underwriterA approves underwriteManager", async function() {
    await expect(
      reSourceToken
        .connect(underwriterA)
        .approve(
          underwriteManager.address,
          ethers.BigNumber.from(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          ),
        ),
    ).to.not.be.reverted
  })

  it("Underwrite 10,000 mu from underwriterA for memberA", async function() {
    await expect(
      underwriteManager
        .connect(underwriterA)
        .underwrite(rUSD.address, ethers.utils.parseEther("10000.0"), memberA.address),
    ).to.emit(underwriteManager, "NewCreditLine")

    expect(
      ethers.utils.formatEther(
        await (await underwriteManager.creditLines(underwriterA.address, memberA.address))
          .collateral,
      ),
    ).to.equal("10000.0")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(underwriterA.address))).to.equal(
      "90000.0",
    )

    expect(ethers.utils.formatUnits(await rUSD.creditLimitOf(memberA.address), "mwei")).to.equal(
      "10000.0",
    )
  })

  it("Revert underwrite with invalid networkToken address", async function() {
    await expect(
      underwriteManager
        .connect(underwriterA)
        .underwrite(
          ethers.Wallet.createRandom().address,
          ethers.utils.parseEther("10000"),
          memberA.address,
        ),
    ).to.be.reverted

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(underwriterA.address))).to.equal(
      "90000.0",
    )

    expect(ethers.utils.formatUnits(await rUSD.creditLimitOf(memberA.address), "mwei")).to.equal(
      "10000.0",
    )
  })

  it("Revert setCreditLimit with invalid wallet", async function() {
    await expect(
      rUSD
        .connect(memberA)
        .setCreditLimit(memberB.address, ethers.utils.parseUnits("100.0", "mwei")),
    ).to.be.reverted
  })

  it("Successfully use memberA credit line and claim underwriterA reward", async function() {
    await expect(
      rUSD.connect(memberA).transfer(memberB.address, ethers.utils.parseUnits("1000.0", "mwei")),
    ).to.emit(rUSD, "Transfer")

    await expect(
      (await underwriteManager.creditLines(underwriterA.address, memberA.address)).reward,
    ).to.equal(ethers.utils.parseEther("20"))
  })

  it("Successfully claims reward for underwriterA", async function() {
    await expect(underwriteManager.connect(underwriterB).claimRewards([memberA.address])).to.be
      .reverted

    await expect(underwriteManager.connect(underwriterA).claimRewards([memberA.address])).to.emit(
      underwriteManager,
      "CreditLineRewardClaimed",
    )

    expect(
      ethers.utils.formatEther(
        await reSourceToken.connect(underwriterA).balanceOf(underwriterA.address),
      ),
    ).to.equal("90020.0")
  })

  it("Extend an additional 5,000 mu from underwriterA for memberA", async function() {
    await expect(
      underwriteManager
        .connect(underwriterA)
        .extendCreditLine(memberB.address, ethers.utils.parseEther("5000")),
    ).to.be.reverted

    await expect(
      underwriteManager
        .connect(underwriterA)
        .extendCreditLine(memberA.address, ethers.utils.parseEther("5000")),
    ).to.emit(underwriteManager, "ExtendCreditLine")

    expect(
      ethers.utils.formatEther(
        await (await underwriteManager.creditLines(underwriterA.address, memberA.address))
          .collateral,
      ),
    ).to.equal("15000.0")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(underwriterA.address))).to.equal(
      "85020.0",
    )

    expect(ethers.utils.formatUnits(await rUSD.creditLimitOf(memberA.address), "mwei")).to.equal(
      "15000.0",
    )
  })

  // TODO: test withdraw
})
