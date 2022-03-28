import { BigNumber } from "@ethersproject/bignumber"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import chai, { expect } from "chai"
import { solidity } from "ethereum-waffle"
import { formatEther, parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { MockERC20 } from "../../types"

import { RewardAddedEvent, WithdrawnEvent } from "../../types/CreditPool"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("CreditPool & Rewards Tests", function() {
  let contracts: ProtocolContracts
  let deployer: SignerWithAddress
  let underwriter: SignerWithAddress
  let member: SignerWithAddress
  let member2: SignerWithAddress

  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()

    deployer = accounts[0]
    underwriter = accounts[1]
    member = accounts[5]
    member2 = accounts[6]

    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Adds and notifies a single reward to pool", async function() {
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

  it("Adds and notifies multiple rewards to pool", async function() {
    const ERC20Factory = await ethers.getContractFactory("MockERC20")
    const rewardToken = (await ERC20Factory.deploy(
      ethers.utils.parseEther("100000000")
    )) as MockERC20

    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("10000"))
    ).wait()

    await (await rewardToken.transfer(underwriter.address, ethers.utils.parseEther("10000"))).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 360)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(rewardToken.address, underwriter.address, 360)
    ).wait()

    expect(await contracts.creditPool.rewardTokens(0)).to.equal(contracts.sourceToken.address)
    expect(await contracts.creditPool.rewardTokens(1)).to.equal(rewardToken.address)

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await rewardToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("250"))
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(rewardToken.address, ethers.utils.parseEther("250"))
    ).wait()

    const rewardAdded = await contracts.creditPool.queryFilter(
      contracts.creditPool.filters.RewardAdded()
    )

    expect(rewardAdded).to.have.lengthOf(2)
  })

  it("Approves and stakes into pool", async function() {
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

  it("Accrues rewards after staking", async function() {
    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 3600)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    log(ethers.utils.formatEther(await contracts.sourceToken.balanceOf(underwriter.address)))

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("100"))
    ).wait()

    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("10000"))
    ).wait()
    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    const earnedBefore = await contracts.creditPool.earned(
      member.address,
      contracts.sourceToken.address
    )

    expect(earnedBefore).to.be.equal(0)

    await (await contracts.creditPool.connect(member).stake(ethers.utils.parseEther("1000"))).wait()

    const timeBefore = await getTimestamp()
    await advanceTime(3600)
    const timeAfter = await getTimestamp()

    expect(timeAfter - timeBefore).to.equal(3600)

    const earnedAfter = await contracts.creditPool.earned(
      member.address,
      contracts.sourceToken.address
    )

    expect(earnedAfter).to.be.above(0)
  })

  it("Claims & withdraws rewards after staking", async function() {
    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("1000"))
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .addReward(contracts.sourceToken.address, underwriter.address, 3600)
    ).wait()

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

    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("10000"))
    ).wait()
    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    const earnedBefore = await contracts.creditPool.earned(
      member.address,
      contracts.sourceToken.address
    )

    await (await contracts.creditPool.connect(member).stake(ethers.utils.parseEther("1000"))).wait()

    await advanceTime(3600)

    const earnedAfter = await contracts.creditPool.earned(
      member.address,
      contracts.sourceToken.address
    )

    expect(earnedAfter.gt(earnedBefore)).to.be.true

    const balanceBeforeExit = await contracts.creditPool.balanceOf(member.address)
    expect(balanceBeforeExit).to.be.above(ethers.utils.parseEther("0.0"))

    await (await contracts.creditPool.connect(member).exit()).wait()

    const withdrawn = (
      await contracts.creditPool.queryFilter(contracts.creditPool.filters.Withdrawn())
    )[0] as WithdrawnEvent

    expect(withdrawn).to.exist
    expect(withdrawn.event).to.equal("Withdrawn")

    const balanceAfterExit = await contracts.creditPool.balanceOf(member.address)
    expect(balanceAfterExit).to.be.equal(ethers.utils.parseEther("0.0"))
  })

  it("Updates locks & balances", async function() {
    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("1000"))
    ).wait()

    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("2000"))
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

    await (
      await contracts.sourceToken
        .connect(deployer)
        .addStakeableContract(contracts.creditPool.address)
    ).wait()

    const schedule = {
      startDate: "Monday Nov 21 2022 22:00:00 GMT-0800 (Pacific Standard Time)",
      periods: 1,
      monthsInPeriod: 1,
    }

    const locked = ethers.utils.parseEther("1000")
    const parsed = getSchedule(
      locked,
      schedule.periods,
      schedule.monthsInPeriod,
      schedule.startDate
    )

    await (
      await contracts.sourceToken.transferWithLock(member.address, {
        totalAmount: locked,
        amountStaked: 0,
        schedules: parsed,
      })
    ).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    const balBefore = await contracts.sourceToken.balanceOf(member.address)
    const lockedbalBefore = await contracts.sourceToken.lockedBalanceOf(member.address)
    expect(floorEth(balBefore)).to.be.equal(floorEth(parseEther("2000")))
    expect(floorEth(lockedbalBefore)).to.be.equal(floorEth(parseEther("1000")))

    const totalStaked = ethers.utils.parseEther("3000")
    await (await contracts.creditPool.connect(member).stake(totalStaked)).wait()

    const balAfter = await contracts.sourceToken.balanceOf(member.address)
    const lockedbalAfter = await contracts.sourceToken.lockedBalanceOf(member.address)
    expect(floorEth(balAfter)).to.be.equal(floorEth(parseEther("0")))
    expect(floorEth(lockedbalAfter)).to.be.equal(floorEth(parseEther("0")))

    // TODO stake half locked, then more, then withdraw, send more locked
    // TODO unstake half, send more locked & unlocked, then withdraw full amount
  })

  it("Ability to stake locked tokens", async function() {
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

    await (
      await contracts.sourceToken
        .connect(deployer)
        .addStakeableContract(contracts.creditPool.address)
    ).wait()

    const { recipient, schedule } = {
      recipient: {
        name: "Member Test",
        address: member.address,
        unlockedAmount: "30",
        lockedAmount: "999",
      },
      schedule: {
        startDate: "Monday Nov 21 2022 22:00:00 GMT-0800 (Pacific Standard Time)",
        periods: 12,
        monthsInPeriod: 1,
      },
    }

    const locked = ethers.utils.parseEther(recipient.lockedAmount)
    const parsed = getSchedule(
      locked,
      schedule.periods,
      schedule.monthsInPeriod,
      schedule.startDate
    )

    await (
      await contracts.sourceToken.transferWithLock(member.address, {
        totalAmount: locked,
        amountStaked: 0,
        schedules: parsed,
      })
    ).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    const lockedbalBefore = await contracts.sourceToken.lockedBalanceOf(member.address)

    await (await contracts.creditPool.connect(member).stake(lockedbalBefore)).wait()

    const totalSupply = formatEther(await contracts.creditPool.totalSupply())
    const amountStaked = formatEther(lockedbalBefore)
    expect(totalSupply).to.equal(amountStaked)

    await advanceTime(3600)

    const earned = await contracts.creditPool.earned(member.address, contracts.sourceToken.address)
    expect(earned).to.be.above(0)

    await (await contracts.creditPool.connect(member).exit()).wait()
    const balAfter = await contracts.sourceToken.balanceOf(member.address)
    expect(floorEth(balAfter)).to.equal(floorEth(earned))

    await (await contracts.sourceToken.connect(member).transfer(member2.address, balAfter)).wait()
    const balAfterXfer = await contracts.sourceToken.balanceOf(member.address)
    expect(floorEth(balAfterXfer)).to.equal(0)
  })
})

const log = (...args: any) => console.log(...args)
const floorEth = (amount: BigNumber) => Math.floor(parseFloat(formatEther(amount) || "0"))

async function getTimestamp() {
  return (await ethers.provider.getBlock("latest")).timestamp
}

async function setBlocktime(newTimestamp) {
  await ethers.provider.send("evm_mine", [newTimestamp])
}

async function advanceTime(seconds) {
  setBlocktime((await getTimestamp()) + seconds)
}

const getSchedule = (amount: BigNumber, periods: number, monthsInPeriod, startDate: string) => {
  const days = 86400
  const month = days * 30
  let startTimeStamp = Date.parse(startDate.toString()) / 1000

  const arr = new Array()
  for (let i = 0; i < periods; i++) {
    arr.push({
      amount: amount.div(BigNumber.from(periods.toString())),
      expirationBlock: startTimeStamp + month * i * monthsInPeriod,
    })
  }

  return arr
}
