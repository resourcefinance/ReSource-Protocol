import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { deployPrtotocolAndNetwork, ProtocolContracts } from "./utils"

chai.use(solidity)

describe("Protocol Access Test", function() {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let ambassador: SignerWithAddress

  // deploy protocol
  this.beforeAll(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    ambassador = accounts[1]
    contracts = await deployPrtotocolAndNetwork()
    await (await contracts.protocolRoles.grantAmbassador(ambassador.address)).wait()
  })

  it("Ambassador invites member", async function() {
    expect(await contracts.protocolRoles.isAmbassador(ambassador.address)).to.equal(true)
  })
})
