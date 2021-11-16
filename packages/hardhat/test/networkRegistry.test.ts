import { upgrades, ethers, getNamedAccounts } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { NetworkRegistry } from "../types/NetworkRegistry"

chai.use(solidity)

describe("Network Registry Tests", function() {
  let deployer: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let memberC: SignerWithAddress
  let memberD: SignerWithAddress
  let operatorA: SignerWithAddress
  let operatorB: SignerWithAddress
  let random: SignerWithAddress
  let networkRegistry: NetworkRegistry

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    memberA = accounts[1]
    memberB = accounts[2]
    memberC = accounts[3]
    memberD = accounts[4]
    operatorA = accounts[5]
    operatorB = accounts[6]
    random = accounts[7]
  })

  it("Successfully deploys a NetworkRegistry", async function() {
    const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")
    getNamedAccounts()
    networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
      [memberA.address, memberB.address],
      [operatorA.address],
      deployer.address,
    ])) as NetworkRegistry

    expect(networkRegistry.address).to.properAddress
    await expect(await networkRegistry.isMember(memberA.address)).to.be.true
    await expect(await networkRegistry.isMember(memberB.address)).to.be.true
    await expect(await networkRegistry.isOperator(operatorA.address)).to.be.true
  })

  it("Unsuccessfully add memberC by random wallet", async () => {
    await expect(networkRegistry.connect(random).addMembers([memberC.address])).to.be.reverted
  })

  it("Successfully add memberC by operatorA", async () => {
    await expect(await networkRegistry.connect(operatorA).addMembers([memberC.address])).to.emit(
      networkRegistry,
      "MemberAddition",
    )
    await expect(await networkRegistry.isMember(memberC.address)).to.be.true
    await expect(await networkRegistry.isMember(memberD.address)).to.be.false
  })

  it("Unsuccessfully add operatorB by random wallet", async () => {
    await expect(networkRegistry.connect(random).addOperator(operatorB.address)).to.be.reverted
  })

  it("Successfully add operatorB", async () => {
    await expect(await networkRegistry.addOperator(operatorB.address)).to.emit(
      networkRegistry,
      "OperatorAddition",
    )
    await expect(await networkRegistry.isOperator(operatorB.address)).to.be.true
  })

  it("Unsuccessfully remove owner by operatorA", async () => {
    await expect(networkRegistry.connect(operatorA).removeOperator(deployer.address)).to.be.reverted
    await expect(await networkRegistry.isOperator(operatorA.address)).to.be.true
    await expect(await networkRegistry.isOperator(deployer.address)).to.be.true
  })

  it("Successfully remove operatorB by owner", async () => {
    await expect(await networkRegistry.removeOperator(operatorB.address)).to.emit(
      networkRegistry,
      "OperatorRemoval",
    )
    await expect(await networkRegistry.isOperator(operatorA.address)).to.be.true
    await expect(await networkRegistry.isOperator(operatorB.address)).to.be.false
    await expect(await networkRegistry.isOperator(deployer.address)).to.be.true
  })

  it("Unsuccessfully add memberD by operatorB", async () => {
    await expect(networkRegistry.connect(operatorB).addMembers([memberD.address])).to.be.reverted
    await expect(await networkRegistry.isMember(memberD.address)).to.be.false
  })

  it("Successfully add memberD by operatorA", async () => {
    await expect(await networkRegistry.connect(operatorA).addMembers([memberD.address])).to.emit(
      networkRegistry,
      "MemberAddition",
    )
    await expect(await networkRegistry.isMember(memberD.address)).to.be.true
  })
})
