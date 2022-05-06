import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { protocolFactory, ProtocolContracts } from "./protocolFactory"

chai.use(solidity)

describe("NetworkAccess Test", function () {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let networkOperator: SignerWithAddress
  let member: SignerWithAddress

  // deploy protocol
  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    networkOperator = accounts[2]
    member = accounts[3]
    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Grant and revoke Operator Role", async function () {
    await (await contracts.networkRoles.grantOperator(networkOperator.address)).wait()
    expect(await contracts.networkRoles.isNetworkOperator(networkOperator.address)).to.equal(true)
    await (await contracts.networkRoles.revokeOperator(networkOperator.address)).wait()
    expect(await contracts.networkRoles.isNetworkOperator(networkOperator.address)).to.equal(false)
  })

  it("Grant membership to member wallet from operator wallet", async function () {
    // grant member role
    await (await contracts.networkRoles.grantMember(member.address)).wait()
    expect(await contracts.networkRoles.isMember(member.address)).to.equal(true)
  })
})
