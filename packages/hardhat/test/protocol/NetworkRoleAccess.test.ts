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
  let networkOperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let newMember: SignerWithAddress

  // deploy protocol
  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    networkOperator = accounts[2]
    ambassador = accounts[3]
    newMember = accounts[4]
    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Grant and revoke Operator Role", async function() {
    await (await contracts.networkRoles.grantOperator(networkOperator.address)).wait()
    expect(await contracts.networkRoles.isNetworkOperator(networkOperator.address)).to.equal(true)
    await (await contracts.networkRoles.revokeOperator(networkOperator.address)).wait()
    expect(await contracts.networkRoles.isNetworkOperator(networkOperator.address)).to.equal(false)
  })

  it("Grant and revoke Ambassadorship role", async function() {
    await (await contracts.networkRoles.grantAmbassador(ambassador.address, 0)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador.address)).to.equal(true)
    await (await contracts.networkRoles.revokeAmbassador(ambassador.address)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador.address)).to.equal(false)
  })

  it("Deploy a valid Member wallet from ambassador", async function() {
    // grant ambassador role
    await (await contracts.networkRoles.grantAmbassador(ambassador.address, 0)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador.address)).to.equal(true)

    const deployedWallet = (
      await (
        await contracts.networkRoles
          .connect(ambassador)
          .deployMemberWallet(
            [ethers.Wallet.createRandom().address],
            [ethers.Wallet.createRandom().address],
            ethers.Wallet.createRandom().address,
            contracts.rUSD.address,
            ambassador.address,
            2,
          )
      ).wait()
    ).events?.find((ev) => ev.event === "RoleGranted")?.args?.account

    expect(deployedWallet).to.be.properAddress
    expect(await contracts.networkRoles.isMember(deployedWallet)).to.equal(true)
  })

  it("Invite and accept Member wallet from ambassador", async function() {
    // grant ambassador role
    await (await contracts.networkRoles.grantAmbassador(ambassador.address, 0)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador.address)).to.equal(true)

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(newMember.address)
    ).wait()
    expect(await contracts.networkRoles.isMember(newMember.address)).to.equal(true)

    await (
      await contracts.networkRoles
        .connect(newMember)
        .acceptMembershipAmbassadorInvitation(contracts.rUSD.address, ambassador.address)
    ).wait()
    expect(await contracts.networkRoles.getMembershipAmbassador(newMember.address)).to.equal(
      ambassador.address,
    )
  })

  it("Transfer ambassador's membership to another ambassador", async function() {
    // grant ambassador role
    await (await contracts.networkRoles.grantAmbassador(ambassador.address, 0)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador.address)).to.equal(true)

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(newMember.address)
    ).wait()
    expect(await contracts.networkRoles.isMember(newMember.address)).to.equal(true)

    await (
      await contracts.networkRoles
        .connect(newMember)
        .acceptMembershipAmbassadorInvitation(contracts.rUSD.address, ambassador.address)
    ).wait()
    expect(await contracts.networkRoles.getMembershipAmbassador(newMember.address)).to.equal(
      ambassador.address,
    )

    const ambassador2 = ethers.Wallet.createRandom()
    await (await contracts.networkRoles.grantAmbassador(ambassador2.address, 0)).wait()
    expect(await contracts.networkRoles.isAmbassador(ambassador2.address)).to.equal(true)

    await await contracts.networkRoles.transferMembershipAmbassador(
      newMember.address,
      ambassador2.address,
    )
    expect(await contracts.networkRoles.getMembershipAmbassador(newMember.address)).to.equal(
      ambassador2.address,
    )
  })
})
