import { ethers, upgrades, getNamedAccounts } from "hardhat"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ResourceToken } from "../types/ResourceToken"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
chai.use(solidity)

describe("UnderwriteManager Tests", function() {
  let deployer: SignerWithAddress
  let resourceToken: ResourceToken

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  it("Successfully deploys proxy mutuality token", async function() {
    const resourceTokenFactory = await ethers.getContractFactory("ResourceToken")

    resourceToken = (await upgrades.deployProxy(resourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
    ])) as ResourceToken
  })
})

// TODO write this test and update the others to use regular test
