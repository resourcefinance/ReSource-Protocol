import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import chai, { expect } from "chai"
import { solidity } from "ethereum-waffle"
import { ethers, upgrades } from "hardhat"

import { MockERC20 } from "../../types"
import { RewardAddedEvent } from "../../types/CreditPool"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("CreditPool & Rewards Tests", function() {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let requestOpperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let member: SignerWithAddress

  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    ambassador = accounts[4]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Add and notify single reward to pool", async function() {
    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("1000"))
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 360)
    ).wait()

    expect(await contracts.creditPool.rewardTokens(0)).to.equal(contracts.sourceToken.address)

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("100"))
    ).wait()

    const rewardAdded = (
      await contracts.creditPool.queryFilter(contracts.creditPool.filters.RewardAdded())
    )[0] as RewardAddedEvent

    expect(rewardAdded).to.exist
    expect(rewardAdded.event).to.equal("RewardAdded")
  })

  it("Add and notify multiple rewards to pool", async function() {
    const ERC20Factory = await ethers.getContractFactory("MockERC20")
    const MockERC20 = (await ERC20Factory.deploy(ethers.utils.parseEther("100000000"))) as MockERC20

    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("10000"))
    ).wait()

    await (await MockERC20.transfer(underwriter.address, ethers.utils.parseEther("10000"))).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 360)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(MockERC20.address, underwriter.address, 360)
    ).wait()

    expect(await contracts.creditPool.rewardTokens(0)).to.equal(contracts.sourceToken.address)
    expect(await contracts.creditPool.rewardTokens(1)).to.equal(MockERC20.address)

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await MockERC20.connect(underwriter).approve(
        contracts.creditPool.address,
        ethers.constants.MaxUint256
      )
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("250"))
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(MockERC20.address, ethers.utils.parseEther("250"))
    ).wait()

    const rewardAdded = await contracts.creditPool.queryFilter(
      contracts.creditPool.filters.RewardAdded()
    )

    expect(rewardAdded).to.have.lengthOf(2)
  })

  it("Approve and Stake into pool", async function() {
    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("100000"))
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 60 * 60 * 60)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("10000"))
    ).wait()

    const seedToken = ethers.utils.parseEther("10000")
    const poolToken = ethers.utils.parseEther("1000")

    await (await contracts.sourceToken.transfer(member.address, seedToken)).wait()
    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    const initialPoolBal = await contracts.creditPool.balanceOf(member.address)
    const initialSeedBal = await contracts.sourceToken.balanceOf(member.address)

    expect(initialSeedBal).to.equal(seedToken)
    expect(initialPoolBal).to.equal(0)

    await (await contracts.creditPool.connect(member).stake(poolToken)).wait()

    const finalSeedBal = await contracts.sourceToken.balanceOf(member.address)
    const postPoolBal = await contracts.creditPool.balanceOf(member.address)

    expect(finalSeedBal).to.equal(seedToken.sub(poolToken))
    expect(postPoolBal).to.equal(poolToken)
  })
})
