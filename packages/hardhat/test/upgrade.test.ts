import { ethers, upgrades, getNamedAccounts } from "hardhat"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ReSourceToken } from "../types/ReSourceToken"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
chai.use(solidity)

describe("UnderwriteManager Tests", function() {
  let deployer: SignerWithAddress
  let reSourceToken: ReSourceToken

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  it("Successfully deploys proxy mutuality token", async function() {
    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")

    reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
    ])) as ReSourceToken
  })
})

// TODO write this test and update the others to use regular test
