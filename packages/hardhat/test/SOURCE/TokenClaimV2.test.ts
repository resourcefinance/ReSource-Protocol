import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "../protocol/protocolFactory"
import { SourceToken, SourceTokenV2, TokenClaim } from "../../types"

chai.use(solidity)

describe("CreditFeeManager Tests", function () {
  let deployer: SignerWithAddress
  let beneficiary: SignerWithAddress
  let sourceToken: SourceTokenV2
  let tokenClaim: TokenClaim

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    beneficiary = accounts[1]
    const SOURCEFactory = await ethers.getContractFactory("SourceToken")
    const sourceTokenV1 = (await upgrades.deployProxy(SOURCEFactory, [
      ethers.utils.parseEther("100000000"),
      [],
    ])) as SourceToken
    const SourceTokenV2 = await ethers.getContractFactory("SourceTokenV2")
    sourceToken = (await upgrades.upgradeProxy(sourceTokenV1.address, SourceTokenV2, {
      call: "upgradeV2",
    })) as SourceTokenV2

    const tokenClaimFactoryV2 = await ethers.getContractFactory("TokenClaimV2")
    tokenClaim = (await upgrades.deployProxy(tokenClaimFactoryV2, [
      sourceToken.address,
    ])) as TokenClaim

    await (
      await sourceToken.transfer(tokenClaim.address, ethers.utils.parseEther("1000000"))
    ).wait()
  })

  it("Create a claim with one schedule for beneficiary and claim", async function () {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiary.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("50000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 90000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiary.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiary.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("100000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("50000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("900000.0")
    let totalClaimable = ethers.utils.formatEther(await tokenClaim.totalClaimable())
    expect(totalClaimable).to.equal("100000.0")

    await ethers.provider.send("evm_increaseTime", [90001])
    await ethers.provider.send("evm_mine", [])

    await (await tokenClaim.connect(beneficiary).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiary.address))).to.equal(
      "100000.0"
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiary.address))
    ).to.equal("0.0")
  })

  it("Create a claim with multiple schedules for beneficiary and claim before expiration", async function () {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiary.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("150000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 100000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 200000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 300000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiary.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiary.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("200000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("150000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("800000.0")
    let totalClaimable = ethers.utils.formatEther(await tokenClaim.totalClaimable())
    expect(totalClaimable).to.equal("200000.0")

    await (await tokenClaim.connect(beneficiary).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiary.address))).to.equal(
      "50000.0"
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiary.address))
    ).to.equal("150000.0")
  })

  it("Create a claim with multiple schedules for beneficiary and claim in the middle of expiration", async function () {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiary.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("150000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 100000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 200000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 300000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiary.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiary.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("200000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("150000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("800000.0")
    let totalClaimable = ethers.utils.formatEther(await tokenClaim.totalClaimable())
    expect(totalClaimable).to.equal("200000.0")

    await ethers.provider.send("evm_increaseTime", [100000])
    await ethers.provider.send("evm_mine", [])

    await (await tokenClaim.connect(beneficiary).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiary.address))).to.equal(
      "100000.0"
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiary.address))
    ).to.equal("100000.0")
  })

  it("Create a claim with multiple schedules for beneficiary and claim at end of expiration", async function () {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiary.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("150000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 100000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 200000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 300000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiary.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiary.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("200000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("150000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("800000.0")
    let totalClaimable = ethers.utils.formatEther(await tokenClaim.totalClaimable())
    expect(totalClaimable).to.equal("200000.0")

    await ethers.provider.send("evm_increaseTime", [300000])
    await ethers.provider.send("evm_mine", [])

    await (await tokenClaim.connect(beneficiary).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiary.address))).to.equal(
      "200000.0"
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiary.address))
    ).to.equal("0.0")
  })

  it("Create a claim with multiple schedules for beneficiary and claim at end of expiration", async function () {
    const now = await (await ethers.provider.getBlock("latest")).timestamp

    await tokenClaim.addClaim(beneficiary.address, ethers.utils.parseEther("50000"), {
      totalAmount: ethers.utils.parseEther("150000"),
      amountStaked: 0,
      schedules: [
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 100000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 300000,
        },
        {
          amount: ethers.utils.parseEther("50000"),
          expirationBlock: now + 200000,
        },
      ],
    })

    const claim = await tokenClaim.claims(beneficiary.address)
    const claimTotal = await tokenClaim.getClaimTotal(beneficiary.address)
    expect(ethers.utils.formatEther(claimTotal)).to.equal("200000.0")
    expect(ethers.utils.formatEther(claim.unlockedAmount)).to.equal("50000.0")
    expect(ethers.utils.formatEther(claim.lock.totalAmount)).to.equal("150000.0")
    expect(claim.released).to.be.false
    let withdrawable = ethers.utils.formatEther(await tokenClaim.getWithdrawableAmount())
    expect(withdrawable).to.equal("800000.0")
    let totalClaimable = ethers.utils.formatEther(await tokenClaim.totalClaimable())
    expect(totalClaimable).to.equal("200000.0")

    await ethers.provider.send("evm_increaseTime", [200000])
    await ethers.provider.send("evm_mine", [])

    await (await tokenClaim.connect(beneficiary).claim()).wait()

    expect(ethers.utils.formatEther(await sourceToken.balanceOf(beneficiary.address))).to.equal(
      "150000.0"
    )
    expect(
      ethers.utils.formatEther(await sourceToken.lockedBalanceOf(beneficiary.address))
    ).to.equal("50000.0")
  })
})
