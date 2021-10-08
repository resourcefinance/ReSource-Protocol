import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { NetworkRegistry } from "../types/NetworkRegistry"
import { ReSourceToken } from "../types/ReSourceToken"

chai.use(solidity)

describe("ReSourcetoken Tests", function() {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress
  let memberD: SignerWithAddress
  let reSourceToken: ReSourceToken
  const stakingContract = ethers.Wallet.createRandom()

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    memberC = accounts[3]
    memberD = accounts[4]
  })

  it("Successfully deploys ReSourceToken", async function() {
    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")
    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("100000000"),
      [stakingContract.address],
    ])) as ReSourceToken

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

    expect(ethers.utils.formatEther(await reSourceToken.locks(memberB.address))).to.equal("0.0")
  })

  it("Successfully sends 2 locked transfers to memberC", async () => {
    await expect(
      reSourceToken.transferWithLock(memberC.address, {
        amount: ethers.utils.parseEther("1000"),
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

    expect(ethers.utils.formatEther(await reSourceToken.locks(memberC.address))).to.equal("0.0")
  })
})
