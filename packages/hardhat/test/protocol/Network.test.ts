import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"

chai.use(solidity)

describe("RUSD Network Tests", function() {
  let deployer: SignerWithAddress

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  it("", async function() {})
})
