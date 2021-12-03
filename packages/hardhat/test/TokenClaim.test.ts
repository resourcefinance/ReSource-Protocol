import { ethers, upgrades, deployments } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { SourceToken } from "../types"
import { TokenClaim } from "../types/TokenClaim"
import { SourceTokenV2 } from "../types/SourceTokenV2"
import { parseEther } from "ethers/lib/utils"

chai.use(solidity)

const secondsInDay = 60 * 60 * 24

describe("TokenClaim Tests", function() {
  let deployer: SignerWithAddress
  let beneficiaryA: SignerWithAddress
  let beneficiaryB: SignerWithAddress
  let sourceToken: SourceTokenV2
  let tokenClaim: TokenClaim

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    beneficiaryA = accounts[1]
    beneficiaryB = accounts[2]
  })

  it("Deploys a SourceToken and TokenClaim contract", async function() {
    const sourceTokenFactory = await ethers.getContractFactory("SourceTokenV2")

    sourceToken = (await upgrades.deployProxy(sourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
      [],
    ])) as SourceTokenV2

    const tokenClaimFactory = await ethers.getContractFactory("TokenClaim")

    tokenClaim = (await upgrades.deployProxy(tokenClaimFactory, [sourceToken.address])).connect(
      deployer,
    ) as TokenClaim

    expect(sourceToken.address).to.properAddress
    expect(tokenClaim.address).to.properAddress
  })

  it("Funds TokenClaim contract", async function() {
    await (
      await sourceToken.transfer(tokenClaim.address, ethers.utils.parseEther("1000000"))
    ).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(tokenClaim.address))).to.equal(
      "1000000.0",
    )
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("1000000.0")
  })

  it("Creates locked and unlocked Claim in TokenClaim contract for beneficiaryA", async function() {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiaryA.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("50000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 90000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiaryA.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiaryA.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("100000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("50000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("900000.0")
  })

  it("beneficiaryA claims tokens", async function() {
    await (await tokenClaim.connect(beneficiaryA).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiaryA.address))).to.equal(
      "50000.0",
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiaryA.address)),
    ).to.equal("50000.0")
    expect((await tokenClaim.claims(beneficiaryA.address)).released).to.be.true
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("900000.0")
  })

  it("Creates unlocked Claim in TokenClaim contract for beneficiaryA", async function() {
    await tokenClaim.addClaim(beneficiaryA.address, ethers.utils.parseEther("25000"), {
      totalAmount: 0,
      amountStaked: 0,
      schedules: [],
    })

    const claim = await tokenClaim.claims(beneficiaryA.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiaryA.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("25000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("25000.0")
    expect((await tokenClaim.claims(beneficiaryA.address)).released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("875000.0")
  })

  it("beneficiaryA claims tokens ", async function() {
    await (await tokenClaim.connect(beneficiaryA).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiaryA.address))).to.equal(
      "75000.0",
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiaryA.address)),
    ).to.equal("50000.0")
    expect((await tokenClaim.claims(beneficiaryA.address)).released).to.be.true
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("875000.0")
  })

  it("Creates locked Claim in TokenClaim contract for beneficiaryA", async function() {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiaryA.address, 0, {
      totalAmount: ethers.utils.parseEther("25000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("25000"),
          expirationBlock: now + 90000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiaryA.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiaryA.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("25000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("0.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("25000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("850000.0")
  })

  it("beneficiaryA claims tokens ", async function() {
    await (await tokenClaim.connect(beneficiaryA).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiaryA.address))).to.equal(
      "75000.0",
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiaryA.address)),
    ).to.equal("75000.0")
    expect((await tokenClaim.claims(beneficiaryA.address)).released).to.be.true
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("850000.0")
  })

  it("Creates Claim in TokenClaim contract for beneficiaryB", async function() {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiaryB.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("50000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 90000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiaryB.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiaryB.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("100000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("50000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("750000.0")
  })

  it("Revoke beneficiaryB claim", async function() {
    await (await tokenClaim.revoke(beneficiaryB.address)).wait()

    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("850000.0")

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiaryB.address))).to.equal(
      "0.0",
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiaryB.address)),
    ).to.equal("0.0")

    await expect(tokenClaim.connect(beneficiaryB).claim()).to.be.reverted

    const claim = await tokenClaim.claims(beneficiaryB.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiaryB.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("0.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("0.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("0.0")
    expect(claim.released).to.be.false
  })

  it("Withdraw total amount from token claim contract", async function() {
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("850000.0")

    await (await tokenClaim.withdraw(await tokenClaim.getWithdrawableAmount())).wait()

    withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("0.0")
  })
})
