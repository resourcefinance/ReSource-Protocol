import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { SourceTokenV2 } from "../../types/SourceTokenV2"
import { SourceToken } from "../../types/SourceToken"
import { SourceTokenV2__factory } from "../../types"

chai.use(solidity)

describe("ReSourceToken Tests", function () {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let stakingContract: SignerWithAddress
  let sourceToken: SourceToken
  let sourceTokenV2: SourceTokenV2

  before(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    stakingContract = accounts[6]
  })

  it("Successfully deploys SourceToken V1", async function () {
    const reSourceTokenFactory = await ethers.getContractFactory("SourceToken")
    sourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("100000000"),
      [stakingContract.address],
    ])) as SourceToken

    expect(await sourceToken.isStakeableContract(stakingContract.address)).to.equal(true)
    await (
      await sourceToken.transfer(stakingContract.address, ethers.utils.parseEther("10000"))
    ).wait()

    expect(sourceToken.address).to.properAddress
  })

  it("Successfully transfers token to memberA", async () => {
    await (await sourceToken.transfer(memberA.address, ethers.utils.parseEther("1000"))).wait()
    expect(ethers.utils.formatEther(await sourceToken.balanceOf(memberA.address))).to.equal(
      "1000.0"
    )
  })

  it("Successfully transfers tokens to memberB with lock of 90000 and 100000 seconds", async () => {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      sourceToken.transferWithLock(memberB.address, {
        totalAmount: ethers.utils.parseEther("1500000"),
        amountStaked: 0,
        schedules: [
          {
            amount: ethers.utils.parseEther("1500000"),
            expirationBlock: now + 90000,
          },
        ],
      })
    ).to.emit(sourceToken, "LockedTransfer")

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(memberB.address))).to.equal(
      "1500000.0"
    )
  })

  it("Successfully upgrades SOURCE", async () => {
    const ReSourceTokenV2 = await ethers.getContractFactory("SourceTokenV2")
    const ReSourceTokenV2Abi = SourceTokenV2__factory.abi

    sourceTokenV2 = (await upgrades.upgradeProxy(sourceToken.address, ReSourceTokenV2, {
      call: "upgradeV2",
    })) as SourceTokenV2

    await expect(sourceTokenV2.upgradeV2()).to.be.reverted

    expect(sourceTokenV2.address).to.properAddress

    expect(ethers.utils.formatEther(await sourceTokenV2.balanceOf(memberB.address))).to.equal("0.0")

    expect(ethers.utils.formatEther(await sourceTokenV2.lockedBalanceOf(memberB.address))).to.equal(
      "1500000.0"
    )

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(memberB.address))).to.equal("0.0")

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(memberA.address))).to.equal(
      "1000.0"
    )

    expect(ethers.utils.formatEther(await sourceTokenV2.totalLocked())).to.equal("1500000.0")

    await ethers.provider.send("evm_increaseTime", [100001])
    await ethers.provider.send("evm_mine", [])

    await expect(
      sourceTokenV2.connect(memberB).transfer(memberA.address, ethers.utils.parseEther("1500000.0"))
    ).to.emit(sourceTokenV2, "Transfer")

    expect(ethers.utils.formatEther(await sourceTokenV2.totalLocked())).to.equal("0.0")
  })

  it("Successfully refunds locked tokens to owner", async () => {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await expect(
      sourceToken.connect(memberA).transferWithLock(memberB.address, {
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
      })
    ).to.emit(sourceToken, "LockedTransfer")

    expect(ethers.utils.formatEther(await sourceTokenV2.balanceOf(deployer.address))).to.equal(
      "98489000.0"
    )
    expect(ethers.utils.formatEther(await sourceTokenV2.lockedBalanceOf(memberB.address))).to.equal(
      "1000.0"
    )

    expect(ethers.utils.formatEther(await sourceTokenV2.totalLocked())).to.equal("1000.0")

    await (await sourceTokenV2.connect(memberB).refundLockedTokensToOwner()).wait()

    expect(ethers.utils.formatEther(await sourceTokenV2.balanceOf(memberB.address))).to.equal("0.0")
    expect(ethers.utils.formatEther(await sourceTokenV2.balanceOf(deployer.address))).to.equal(
      "98490000.0"
    )
    expect(ethers.utils.formatEther(await sourceTokenV2.totalLocked())).to.equal("0.0")
  })
})
