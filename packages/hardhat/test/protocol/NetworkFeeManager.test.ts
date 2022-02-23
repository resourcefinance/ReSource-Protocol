import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("NetworkFeeManager Tests", function() {
  let contracts: ProtocolContracts
  let deployer: SignerWithAddress
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let networkOperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let member: SignerWithAddress

  // deploy protocol
  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    networkOperator = accounts[3]
    ambassador = accounts[4]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Collects and claim fees from member", async function() {
    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("200"))
    ).wait()

    expect(await contracts.sourceToken.balanceOf(member.address)).to.equal(
      ethers.utils.parseEther("200.0"),
    )

    await (await contracts.networkFeeManager.registerNetwork(network.address)).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.networkFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.networkFeeManager
        .connect(network)
        .collectFees(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("1000", "mwei"),
        )
    ).wait()

    expect(await contracts.sourceToken.balanceOf(member.address)).to.equal(
      ethers.utils.parseEther("0.0"),
    )

    await (await contracts.networkRoles.grantAmbassador(ambassador.address, 0)).wait()
    await (await contracts.networkRoles.grantOperator(networkOperator.address)).wait()

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(member.address)
    ).wait()
    await (
      await contracts.networkRoles
        .connect(member)
        .acceptMembershipAmbassadorInvitation(contracts.rUSD.address, ambassador.address)
    ).wait()

    expect(await contracts.sourceToken.balanceOf(ambassador.address)).to.equal(
      ethers.utils.parseEther("0.0"),
    )
    await (
      await contracts.networkFeeManager.connect(ambassador).claimAmbassadorFees([member.address])
    ).wait()
    expect(await contracts.sourceToken.balanceOf(ambassador.address)).to.equal(
      ethers.utils.parseEther("50.0"),
    )
    expect(await contracts.sourceToken.balanceOf(networkOperator.address)).to.equal(
      ethers.utils.parseEther("0.0"),
    )
    const balance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(contracts.networkFeeManager.address),
    )

    await (
      await contracts.networkFeeManager.connect(networkOperator).claimNetworkFees([member.address])
    ).wait()
    expect(await contracts.sourceToken.balanceOf(networkOperator.address)).to.equal(
      ethers.utils.parseEther("50.0"),
    )
  })

  it("Collecting reverts from insufficient source balance", async function() {
    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("199"))
    ).wait()

    expect(await contracts.sourceToken.balanceOf(member.address)).to.equal(
      ethers.utils.parseEther("199.0"),
    )

    await (await contracts.networkFeeManager.registerNetwork(network.address)).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.networkFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(member)
        .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await expect(
      contracts.networkFeeManager
        .connect(network)
        .collectFees(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("1000", "mwei"),
        ),
    ).to.be.reverted
  })
})
