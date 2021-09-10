import { ethers, upgrades } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { Contract } from "ethers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { CIP36 } from "../types/CIP36"
chai.use(solidity)

describe("CIP36 Tests", function() {
  let signerA: SignerWithAddress
  let signerB: SignerWithAddress
  let signerC: SignerWithAddress
  let underwriteManagerFaker: SignerWithAddress
  let CIP36Contract: Contract

  before(async function() {
    const accounts = await ethers.getSigners()
    signerA = accounts[1]
    signerB = accounts[2]
    signerC = accounts[3]
    underwriteManagerFaker = accounts[4]
  })

  it("Successfully deploys CIP36 contract", async function() {
    const CIP36Factory = await ethers.getContractFactory("CIP36")
    CIP36Contract = (await upgrades.deployProxy(CIP36Factory, [
      "RUSD",
      "RUSD",
      underwriteManagerFaker.address,
    ])) as CIP36
    expect(CIP36Contract.address).to.properAddress
  })

  it("Successfully assigns wallet A a credit limit of 1000", async function() {
    await expect(
      CIP36Contract.setCreditLimit(signerA.address, ethers.utils.parseUnits("1000.0", "mwei")),
    ).to.emit(CIP36Contract, "CreditLimitUpdate")
  })

  it("Wallet A Successfully sends wallet B 900 rUSD", async function() {
    await expect(
      CIP36Contract.connect(signerA).transfer(
        signerB.address,
        ethers.utils.parseUnits("900.0", "mwei"),
      ),
    ).to.emit(CIP36Contract, "Transfer")
  })

  it("Wallet A Successfully sends wallet C 50 rUSD", async function() {
    await expect(
      CIP36Contract.connect(signerA).transfer(
        signerC.address,
        ethers.utils.parseUnits("50.0", "mwei"),
      ),
    ).to.emit(CIP36Contract, "Transfer")
  })

  it("Wallet A fails to sends wallet B an additioanl 51 rUSD", async function() {
    await expect(
      CIP36Contract.connect(signerA).transfer(
        signerB.address,
        ethers.utils.parseUnits("51.0", "mwei"),
      ),
    ).to.be.reverted
  })

  it("Wallet B Successfully sends wallet C 200 rUSD", async function() {
    await expect(
      CIP36Contract.connect(signerB).transfer(
        signerC.address,
        ethers.utils.parseUnits("200.0", "mwei"),
      ),
    ).to.emit(CIP36Contract, "Transfer")
  })
})
