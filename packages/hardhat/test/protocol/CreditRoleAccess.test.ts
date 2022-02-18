import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { protocolFactory, ProtocolContracts } from "./protocolFactory"

chai.use(solidity)

describe("NetworkAccess Test", function() {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let creditOperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let request: SignerWithAddress

  // deploy protocol
  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    creditOperator = accounts[2]
    ambassador = accounts[3]
    request = accounts[4]

    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Grant and revoke Operator Role", async function() {
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    expect(await contracts.creditRoles.isCreditOperator(creditOperator.address)).to.equal(true)
    await (await contracts.creditRoles.revokeOperator(creditOperator.address)).wait()
    expect(await contracts.creditRoles.isCreditOperator(creditOperator.address)).to.equal(false)
  })

  it("Grant and revoke Underwriter role", async function() {
    expect(await contracts.creditRoles.isUnderwriter(underwriter.address)).to.equal(true)
    await (await contracts.creditRoles.revokeUnderwriter(underwriter.address)).wait()
    expect(await contracts.creditRoles.isUnderwriter(underwriter.address)).to.equal(false)
  })

  it("Grant and revoke Network role", async function() {
    await (await contracts.creditRoles.grantNetwork(contracts.rUSD.address)).wait()
    expect(await contracts.creditRoles.isNetwork(contracts.rUSD.address)).to.equal(true)
    await (await contracts.creditRoles.revokeNetwork(contracts.rUSD.address)).wait()
    expect(await contracts.creditRoles.isNetwork(contracts.rUSD.address)).to.equal(false)
  })

  it("Grant and revoke Request role", async function() {
    await (await contracts.creditRoles.grantRequestOperator(request.address)).wait()
    expect(await contracts.creditRoles.isRequestOperator(request.address)).to.equal(true)
    await (await contracts.creditRoles.revokeRequestOperator(request.address)).wait()
    expect(await contracts.creditRoles.isRequestOperator(request.address)).to.equal(false)
  })
})
