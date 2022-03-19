import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("Protocol Tests", function () {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let requestOpperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let creditOperator: SignerWithAddress

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    ambassador = accounts[4]
    memberA = accounts[5]
    memberB = accounts[6]
    creditOperator = accounts[7]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.rUSD.address)).wait()
  })

  it("create, use, and claim reward fees for credit line", async function () {
    // Add two members as ambassador pre approved for 100
    await (
      await contracts.networkRoles.grantAmbassador(
        ambassador.address,
        ethers.utils.parseUnits("100", "mwei")
      )
    ).wait()

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(memberA.address)
    ).wait()
    await (
      await contracts.networkRoles
        .connect(memberA)
        .acceptMembershipAmbassadorInvitation(ambassador.address)
    ).wait()

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(memberB.address)
    ).wait()
    await (
      await contracts.networkRoles
        .connect(memberB)
        .acceptMembershipAmbassadorInvitation(ambassador.address)
    ).wait()

    const creditLimitA = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(memberA.address),
      "mwei"
    )
    expect(creditLimitA).to.equal("100.0")

    // request a credit line for memberA as ambassador
    await (
      await contracts.creditRequest
        .connect(ambassador)
        .createRequest(
          contracts.rUSD.address,
          memberA.address,
          ethers.utils.parseUnits("999", "mwei")
        )
    ).wait()

    // update and approve request as request operator
    await (
      await contracts.creditRequest.updateRequestLimit(
        contracts.rUSD.address,
        memberA.address,
        ethers.utils.parseUnits("1000", "mwei"),
        true
      )
    ).wait()

    // accept request as underwriter
    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, memberA.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(memberA.address),
      "mwei"
    )

    expect(creditLimit).to.equal("1000.0")

    // send funds from memberA to memberB
    await (
      await contracts.sourceToken.transfer(memberA.address, ethers.utils.parseEther("200"))
    ).wait()
    let sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(memberA.address)
    )

    expect(sourceBalance).to.equal("200.0")

    await (
      await contracts.sourceToken
        .connect(memberA)
        .approve(contracts.networkFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(memberA)
        .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.rUSD
        .connect(memberA)
        .transfer(memberB.address, ethers.utils.parseUnits("1000", "mwei"))
    ).wait()

    sourceBalance = ethers.utils.formatEther(await contracts.sourceToken.balanceOf(memberA.address))
    expect(sourceBalance).to.equal("0.0")

    // claim networkFees as ambassador
    await (
      await contracts.networkFeeManager.connect(ambassador).claimRewards([memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(ambassador.address)
    )
    expect(sourceBalance).to.equal("50.0")

    // claim networkFees as networkOperator
    await (await contracts.networkRoles.grantOperator(network.address)).wait()

    await (
      await contracts.networkFeeManager.connect(network).claimRewards([memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(ambassador.address)
    )
    expect(sourceBalance).to.equal("50.0")

    // try claim creditFees as creditOperator
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    await (
      await contracts.creditFeeManager
        .connect(creditOperator)
        .distributeFees(contracts.rUSD.address, [memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(creditOperator.address)
    )
    expect(sourceBalance).to.equal("0.0")

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(contracts.creditPool.address)
    )
    expect(sourceBalance).to.equal("100.0")
  })
  it("create, use, and claim reward fees for credit line with SOURCE at .50cents", async function () {
    await await contracts.priceOracle.setPrice(500)

    // Add two members as ambassador pre approved for 100
    await (
      await contracts.networkRoles.grantAmbassador(
        ambassador.address,
        ethers.utils.parseUnits("100", "mwei")
      )
    ).wait()

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(memberA.address)
    ).wait()
    await (
      await contracts.networkRoles
        .connect(memberA)
        .acceptMembershipAmbassadorInvitation(ambassador.address)
    ).wait()

    await (
      await contracts.networkRoles
        .connect(ambassador)
        .createMembershipAmbassadorInvite(memberB.address)
    ).wait()
    await (
      await contracts.networkRoles
        .connect(memberB)
        .acceptMembershipAmbassadorInvitation(ambassador.address)
    ).wait()

    const creditLimitA = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(memberA.address),
      "mwei"
    )
    expect(creditLimitA).to.equal("100.0")

    // request a credit line for memberA as ambassador
    await (
      await contracts.creditRequest
        .connect(ambassador)
        .createRequest(
          contracts.rUSD.address,
          memberA.address,
          ethers.utils.parseUnits("999", "mwei")
        )
    ).wait()

    // update and approve request as request operator
    await (
      await contracts.creditRequest.updateRequestLimit(
        contracts.rUSD.address,
        memberA.address,
        ethers.utils.parseUnits("1000", "mwei"),
        true
      )
    ).wait()

    // accept request as underwriter
    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, memberA.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(memberA.address),
      "mwei"
    )

    expect(creditLimit).to.equal("1000.0")

    // send funds from memberA to memberB
    await (
      await contracts.sourceToken.transfer(memberA.address, ethers.utils.parseEther("200"))
    ).wait()
    let sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(memberA.address)
    )

    expect(sourceBalance).to.equal("200.0")

    await (
      await contracts.sourceToken
        .connect(memberA)
        .approve(contracts.networkFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(memberA)
        .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.rUSD
        .connect(memberA)
        .transfer(memberB.address, ethers.utils.parseUnits("1000", "mwei"))
    ).wait()

    sourceBalance = ethers.utils.formatEther(await contracts.sourceToken.balanceOf(memberA.address))
    expect(sourceBalance).to.equal("100.0")

    // claim networkFees as ambassador
    await (
      await contracts.networkFeeManager.connect(ambassador).claimRewards([memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(ambassador.address)
    )
    expect(sourceBalance).to.equal("25.0")

    // claim networkFees as networkOperator
    await (await contracts.networkRoles.grantOperator(network.address)).wait()

    await (
      await contracts.networkFeeManager.connect(network).claimRewards([memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(ambassador.address)
    )
    expect(sourceBalance).to.equal("25.0")

    // try claim creditFees as creditOperator
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    await (
      await contracts.creditFeeManager
        .connect(creditOperator)
        .distributeFees(contracts.rUSD.address, [memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(creditOperator.address)
    )
    expect(sourceBalance).to.equal("0.0")

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(contracts.creditPool.address)
    )
    expect(sourceBalance).to.equal("50.0")
  })
})
