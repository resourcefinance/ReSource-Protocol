import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { SourceToken } from "../../types/SourceToken"

chai.use(solidity)

describe("ReSourceToken Tests", function() {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress
  let memberD: SignerWithAddress
  let memberE: SignerWithAddress
  let stakingContract: SignerWithAddress
  let reSourceToken: SourceToken

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
    const reSourceTokenFactory = await ethers.getContractFactory("SourceToken")
    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("100000000"),
      [stakingContract.address],
    ])) as SourceToken

    expect(await reSourceToken.isStakeableContract(stakingContract.address)).to.equal(true)
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

  it("Successfully transfers token to memberB with lock of 90000 and 100000 seconds", async () => {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      reSourceToken.transferWithLock(memberB.address, {
        totalAmount: ethers.utils.parseEther("1000"),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("300"),
            expirationBlock: now + 90000,
          },
          {
            amount: ethers.utils.parseEther("700"),
            expirationBlock: now + 100000,
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

    await ethers.provider.send("evm_increaseTime", [90001])
    await ethers.provider.send("evm_mine", [])

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("301.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("300.0")),
    ).to.emit(reSourceToken, "Transfer")

    await ethers.provider.send("evm_increaseTime", [100001])
    await ethers.provider.send("evm_mine", [])

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("701.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberB).transfer(memberC.address, ethers.utils.parseEther("700.0")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberB.address)).totalAmount),
    ).to.equal("0.0")
  })

  it("Successfully sends 2 locked transfers to memberC", async () => {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      reSourceToken.transferWithLock(memberC.address, {
        totalAmount: ethers.utils.parseEther("1000"),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("300"),
            expirationBlock: now + 90000,
          },
          {
            amount: ethers.utils.parseEther("700"),
            expirationBlock: now + 100000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    // 1k unlocked, 300 @ 5k seconds, 700 @ 10k seconds
    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberC.address))).to.equal(
      "2000.0",
    )

    expect(ethers.utils.formatEther(await reSourceToken.balanceOf(memberD.address))).to.equal("0.0")

    await ethers.provider.send("evm_increaseTime", [90001])
    await ethers.provider.send("evm_mine", [])

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1301.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1300.0")),
    ).to.emit(reSourceToken, "Transfer")

    // 700 @ 5k seconds

    const newNow = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      reSourceToken.transferWithLock(memberC.address, {
        totalAmount: ethers.utils.parseEther("500"),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("500"),
            expirationBlock: newNow + 90000,
          },
        ],
      }),
    ).to.emit(reSourceToken, "LockedTransfer")

    // 700 @ 5k seconds, 500 @ 5k seconds

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("500.0")),
    ).to.be.reverted

    await ethers.provider.send("evm_increaseTime", [90001])
    await ethers.provider.send("evm_mine", [])

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1201.0")),
    ).to.be.reverted

    await expect(
      reSourceToken.connect(memberC).transfer(memberD.address, ethers.utils.parseEther("1200.0")),
    ).to.emit(reSourceToken, "Transfer")

    expect(
      ethers.utils.formatEther(await (await reSourceToken.locks(memberC.address)).totalAmount),
    ).to.equal("0.0")
  })

  it("Successfully sends a locked transfers to memberE", async () => {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      reSourceToken.transferWithLock(memberE.address, {
        totalAmount: ethers.utils.parseEther("1000"),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("1000"),
            expirationBlock: now + 90000,
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
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).amountStaked),
    ).to.equal("1000.0")

    // 200 unlocked tokens
    await expect(reSourceToken.transfer(memberE.address, ethers.utils.parseEther("200"))).to.emit(
      reSourceToken,
      "Transfer",
    )

    // send 200 unlocked
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
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).amountStaked),
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
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).amountStaked),
    ).to.equal("0.0")

    await ethers.provider.send("evm_increaseTime", [90001])
    await ethers.provider.send("evm_mine", [])

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
      ethers.utils.formatEther(await (await reSourceToken.locks(memberE.address)).totalAmount),
    ).to.equal("0.0")
  })
})
