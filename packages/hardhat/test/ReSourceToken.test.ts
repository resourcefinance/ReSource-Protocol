import { upgrades, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ReSourceToken } from "../types/ReSourceToken"

chai.use(solidity)

describe("ReSourcetoken Tests", function() {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress
  let memberD: SignerWithAddress
  let memberE: SignerWithAddress
  let stakingContract: SignerWithAddress
  let reSourceToken: ReSourceToken

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    memberC = accounts[3]
    memberD = accounts[4]
    memberE = accounts[5]
    stakingContract = accounts[6]
  })

  it("Successfully deploys ReSourceToken", async function() {
    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")
    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("100000000"),
      [stakingContract.address],
    ])) as ReSourceToken

    expect(await reSourceToken.isStakableContract(stakingContract.address)).to.equal(true)
    await (
      await reSourceToken.transfer(stakingContract.address, ethers.utils.parseEther("10000"))
    ).wait()

    expect(reSourceToken.address).to.properAddress
  })

  it("Successfully transfers token to memberA", async () => {
    await (await reSourceToken.transfer(memberA.address, ethers.utils.parseEther("1000"))).wait()
    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberA.address))).to.equal(
      "1000.0",
    )
  })

  it("Successfully transfers token to memberB with lock of 5 and 10 seconds", async () => {
    await expect(
      reSourceToken.transferWithLock(memberB.address, {
        amount: ethers.utils.parseEther("1000"),
        staked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("300"),
            expiration: 5000,
          },
          {
            amount: ethers.utils.parseEther("700"),
            expiration: 10000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberB.address))).to.equal(
      "1000.0",
    )

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("100.0")),
    ).to.be.reverted

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberC.address))).to.equal("0.0")

    await ethers.provider.send("evm_increaseTime", [5001])

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("301.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("300.0")),
    ).to.emit(reSourceToken, "Transfer")

    await ethers.provider.send("evm_increaseTime", [5000])

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("701.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("700.0")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberB.address)).amount),
    ).to.equal("0.0")
  })

  it("Successfully sends 2 locked transfers to memberC", async () => {
    await expect(
      reSourceToken.transferWithLock(memberC.address, {
        amount: ethers.utils.parseEther("1000"),
        staked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("300"),
            expiration: 5000,
          },
          {
            amount: ethers.utils.parseEther("700"),
            expiration: 10000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberC.address))).to.equal(
      "2000.0",
    )

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberD.address))).to.equal("0.0")

    await ethers.provider.send("evm_increaseTime", [5001])

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1301.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1300.0")),
    ).to.emit(reSourceToken, "Transfer")

    await expect(
      reSourceToken.transferWithLock(memberC.address, {
        amount: ethers.utils.parseEther("500"),
        staked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("500"),
            expiration: 5000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("500.0")),
    ).to.be.reverted

    await ethers.provider.send("evm_increaseTime", [5000])

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1201.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1200.0")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberC.address)).amount),
    ).to.equal("0.0")
  })

  it("Successfully sends a locked transfers to memberE", async () => {
    await expect(
      reSourceToken.transferWithLock(memberE.address, {
        amount: ethers.utils.parseEther("1000"),
        staked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("1000"),
            expiration: 5000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberE.address))).to.equal(
      "1000.0",
    )

    await expect(
      reSourceToken.connect(memberE).transfer(memberD.address, ethers.utils.parseEther("500")),
    ).to.be.reverted
  })
  it("Successfully stakes memberE locked tokens", async () => {
    // stake 1000
    await expect(
      reSourceToken
        .connect(memberE)
        .transfer(stakingContract.address, ethers.utils.parseEther("1000")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).staked),
    ).to.equal("1000.0")

    // get another 200 unlocked tokens
    await expect(reSourceToken.transfer(memberE.address, ethers.utils.parseEther("200"))).to.emit(
      reSourceToken,
      "Transfer",
    )

    // send the 200 unlocked
    await expect(
      reSourceToken.connect(memberE).transfer(memberD.address, ethers.utils.parseEther("200")),
    ).to.emit(reSourceToken, "Transfer")

    // unstake 200
    await expect(
      reSourceToken
        .connect(stakingContract)
        .transfer(memberE.address, ethers.utils.parseEther("200")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).staked),
    ).to.equal("800.0")

    // fail to send the unstaked 200
    await expect(
      reSourceToken.connect(memberE).transfer(memberD.address, ethers.utils.parseEther("200")),
    ).to.be.reverted

    // send 250 rewards
    await expect(
      reSourceToken
        .connect(stakingContract)
        .transfer(memberE.address, ethers.utils.parseEther("2500")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).staked),
    ).to.equal("0.0")

    await ethers.provider.send("evm_increaseTime", [5001])

    await expect(
      reSourceToken.connect(memberE).transfer(memberD.address, ethers.utils.parseEther("200")),
    ).to.emit(reSourceToken, "Transfer")

    await expect(
      reSourceToken
        .connect(stakingContract)
        .transfer(memberE.address, ethers.utils.parseEther("800")),
    ).to.emit(reSourceToken, "Transfer")

    await expect(
      reSourceToken.connect(memberE).transfer(memberD.address, ethers.utils.parseEther("800")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).amount),
    ).to.equal("0.0")
  })
})
