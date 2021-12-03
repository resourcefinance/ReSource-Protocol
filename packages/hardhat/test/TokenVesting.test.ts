import { ethers, upgrades, deployments } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { TokenVesting, SourceToken } from "../types"

chai.use(solidity)

const secondsInDay = 60 * 60 * 24

describe("TokenVesting Tests", function() {
  let deployer: SignerWithAddress
  let beneficiaryA: SignerWithAddress
  let beneficiaryB: SignerWithAddress
  let beneficiaryC: SignerWithAddress
  let beneficiaryD: SignerWithAddress
  let reSourceToken: SourceToken
  let tokenVesting: TokenVesting

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    beneficiaryA = accounts[1]
    beneficiaryB = accounts[2]
    beneficiaryC = accounts[3]
    beneficiaryD = accounts[4]
  })

  it("Successfully deploys a ReSourceToken and TokenVesting contract", async function() {
    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")

    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
      [],
    ])) as SourceToken

    const tokenVestingFactory = await ethers.getContractFactory("TokenVesting")

    tokenVesting = (await tokenVestingFactory.deploy(reSourceToken.address)) as TokenVesting

    expect(reSourceToken.address).to.properAddress
    expect(tokenVesting.address).to.properAddress
  })

  it("Successfully creates the group 1 vesting schedule", async function() {
    // send vesting contract 100k SOURCE
    await (
      await reSourceToken.transfer(tokenVesting.address, ethers.utils.parseEther("100000"))
    ).wait()

    // create vesting schedule for beneficiaryA
    const startTime = await (await ethers.provider.getBlock("latest")).timestamp
    const cliffInSeconds = secondsInDay * 360 // 1 year
    const durationInSeconds = secondsInDay * 360 * 3 // 3 years in seconds
    const slicePeriodSeconds = secondsInDay * 30

    await (
      await tokenVesting.createVestingSchedule(
        beneficiaryA.address,
        startTime,
        cliffInSeconds,
        durationInSeconds,
        slicePeriodSeconds,
        true,
        ethers.utils.parseEther("100000"),
      )
    ).wait()

    const newSchedule = await tokenVesting.getVestingScheduleByAddressAndIndex(
      beneficiaryA.address,
      0,
    )

    expect(newSchedule.beneficiary).to.properAddress
  })
  it("Successfully releases first month of vesting for beneficiaryA schedule", async function() {
    await ethers.provider.send("evm_increaseTime", [secondsInDay * 360]) // wait 1 year
    await ethers.provider.send("evm_mine", [])

    const scheduleId = await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
      beneficiaryA.address,
      0,
    )

    const amount = await tokenVesting.computeReleasableAmount(scheduleId)
    await (await tokenVesting.connect(beneficiaryA).release(scheduleId, amount)).wait()

    const beneficiaryBalance = ethers.utils.formatEther(
      await reSourceToken.balanceOf(beneficiaryA.address),
    )

    expect(beneficiaryBalance).to.equal("33333.333333333333333333")
  })

  it("Successfully creates the group 2 vesting schedule", async function() {
    // send vesting contract 100k SOURCE
    await (
      await reSourceToken.transfer(tokenVesting.address, ethers.utils.parseEther("100000"))
    ).wait()

    // create vesting schedule for beneficiaryB
    const startTime = await (await ethers.provider.getBlock("latest")).timestamp
    const cliffInSeconds = secondsInDay * 360 // 1 year
    const durationInSeconds = secondsInDay * 360 * 2 // 2 years in seconds
    const slicePeriodSeconds = secondsInDay * 30

    await (
      await tokenVesting.createVestingSchedule(
        beneficiaryB.address,
        startTime,
        cliffInSeconds,
        durationInSeconds,
        slicePeriodSeconds,
        true,
        ethers.utils.parseEther("100000"),
      )
    ).wait()

    const newSchedule = await tokenVesting.getVestingScheduleByAddressAndIndex(
      beneficiaryB.address,
      0,
    )

    expect(newSchedule.amountTotal).to.not.be.null
  })
  it("Successfully releases first month of vesting for beneficiaryB schedule", async function() {
    await ethers.provider.send("evm_increaseTime", [secondsInDay * 360]) // wait 1 year (cliff)
    await ethers.provider.send("evm_mine", [])

    const scheduleId = await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
      beneficiaryB.address,
      0,
    )

    const amount = await tokenVesting.computeReleasableAmount(scheduleId)
    await (await tokenVesting.connect(beneficiaryB).release(scheduleId, amount)).wait()

    const beneficiaryBalance = ethers.utils.formatEther(
      await reSourceToken.balanceOf(beneficiaryB.address),
    )

    expect(beneficiaryBalance).to.equal("50000.0")
  })

  it("Successfully creates the group 3 vesting schedule", async function() {
    // send vesting contract 100k SOURCE
    await (
      await reSourceToken.transfer(tokenVesting.address, ethers.utils.parseEther("100000"))
    ).wait()

    // create vesting schedule for beneficiaryC
    const startTime = await (await ethers.provider.getBlock("latest")).timestamp
    const cliffInSeconds = secondsInDay * 360 // 1 year
    const durationInSeconds = secondsInDay * 360 * 2 // 2 years in seconds
    const slicePeriodSeconds = secondsInDay * 30

    await (
      await tokenVesting.createVestingSchedule(
        beneficiaryC.address,
        startTime,
        cliffInSeconds,
        durationInSeconds,
        slicePeriodSeconds,
        true,
        ethers.utils.parseEther("100000"),
      )
    ).wait()

    const newSchedule = await tokenVesting.getVestingScheduleByAddressAndIndex(
      beneficiaryC.address,
      0,
    )

    expect(newSchedule.beneficiary).to.properAddress
  })
  it("Successfully reclaims beneficiaryC schedule", async function() {
    const scheduleId = await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
      beneficiaryC.address,
      0,
    )

    let withdrawableAmount = ethers.utils.formatEther(await tokenVesting.getWithdrawableAmount())

    expect(withdrawableAmount).to.equal("0.0")

    await (await tokenVesting.revoke(scheduleId)).wait()

    withdrawableAmount = ethers.utils.formatEther(await tokenVesting.getWithdrawableAmount())

    expect(withdrawableAmount).to.equal("100000.0")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(deployer.address))).to.equal(
      "9700000.0",
    )

    await (await tokenVesting.withdraw(await tokenVesting.getWithdrawableAmount())).wait()

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(deployer.address))).to.equal(
      "9800000.0",
    )
  })
})
