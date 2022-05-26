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
  let memberA: SignerWithAddress
  let memberB: SignerWithAddress
  let creditOperator: SignerWithAddress

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    memberA = accounts[5]
    memberB = accounts[6]
    creditOperator = accounts[7]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.RSD.address)).wait()
  })

  it("create, use, and claim reward fees for credit line into under collateralized pool", async function () {
    await (await contracts.networkRoles.grantMember(memberA.address)).wait()
    await (await contracts.networkRoles.grantMember(memberB.address)).wait()

    // request a credit line for memberA as memberA
    await (
      await contracts.creditRequest
        .connect(memberA)
        .createRequest(
          contracts.RSD.address,
          memberA.address,
          ethers.utils.parseUnits("999", "mwei")
        )
    ).wait()

    // update and approve request as request operator
    await (
      await contracts.creditRequest.updateRequestLimit(
        contracts.RSD.address,
        memberA.address,
        ethers.utils.parseUnits("1000", "mwei"),
        true
      )
    ).wait()

    // accept request as underwriter
    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, memberA.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(memberA.address),
      "mwei"
    )

    expect(creditLimit).to.equal("1000.0")

    expect(ethers.utils.formatUnits(await contracts.creditPool.totalCredit(), "mwei")).to.equal(
      "1000.0"
    )

    await (
      await contracts.sourceToken.approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()
    await (await contracts.creditPool.stake(ethers.utils.parseEther("199"))).wait()

    const LTV =
      Number(
        ethers.utils.formatUnits(
          await contracts.creditManager.calculatePoolLTV(
            contracts.RSD.address,
            contracts.creditPool.address
          ),
          "wei"
        )
      ) / 10000

    expect(LTV).to.equal(19.9)

    expect(
      await contracts.creditManager.isPoolValidLTV(
        contracts.RSD.address,
        contracts.creditPool.address
      )
    ).to.be.false

    // send funds from memberA to memberB
    await (
      await contracts.sourceToken.transfer(memberA.address, ethers.utils.parseEther("100"))
    ).wait()
    let sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(memberA.address)
    )

    expect(sourceBalance).to.equal("100.0")

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
      await contracts.RSD.connect(memberA).transfer(
        memberB.address,
        ethers.utils.parseUnits("1000", "mwei")
      )
    ).wait()

    sourceBalance = ethers.utils.formatEther(await contracts.sourceToken.balanceOf(memberA.address))
    expect(sourceBalance).to.equal("0.0")

    // try claim creditFees as creditOperator
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    await (
      await contracts.creditFeeManager
        .connect(creditOperator)
        .distributeFees(contracts.RSD.address, [memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(creditOperator.address)
    )
    expect(sourceBalance).to.equal("0.0")

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(contracts.creditPool.address)
    )

    expect(ethers.utils.formatEther(await contracts.creditPool.totalSupply())).to.eql("200.0") // total staked should be 200

    expect(sourceBalance).to.equal("299.0")
  })
  it("create, use, and claim reward fees for credit line into over collateralized pool", async function () {
    await (await contracts.networkRoles.grantMember(memberA.address)).wait()
    await (await contracts.networkRoles.grantMember(memberB.address)).wait()

    // request a credit line for memberA as memberA
    await (
      await contracts.creditRequest
        .connect(memberA)
        .createRequest(
          contracts.RSD.address,
          memberA.address,
          ethers.utils.parseUnits("999", "mwei")
        )
    ).wait()

    // update and approve request as request operator
    await (
      await contracts.creditRequest.updateRequestLimit(
        contracts.RSD.address,
        memberA.address,
        ethers.utils.parseUnits("1000", "mwei"),
        true
      )
    ).wait()

    // accept request as underwriter
    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, memberA.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(memberA.address),
      "mwei"
    )

    expect(creditLimit).to.equal("1000.0")

    expect(ethers.utils.formatUnits(await contracts.creditPool.totalCredit(), "mwei")).to.equal(
      "1000.0"
    )

    await (
      await contracts.sourceToken.approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()
    await (await contracts.creditPool.stake(ethers.utils.parseEther("200"))).wait()

    const LTV =
      Number(
        ethers.utils.formatUnits(
          await contracts.creditManager.calculatePoolLTV(
            contracts.RSD.address,
            contracts.creditPool.address
          ),
          "wei"
        )
      ) / 10000

    expect(LTV).to.equal(20)

    // send funds from memberA to memberB
    await (
      await contracts.sourceToken.transfer(memberA.address, ethers.utils.parseEther("100"))
    ).wait()
    let sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(memberA.address)
    )

    expect(sourceBalance).to.equal("100.0")

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
      await contracts.RSD.connect(memberA).transfer(
        memberB.address,
        ethers.utils.parseUnits("1000", "mwei")
      )
    ).wait()

    sourceBalance = ethers.utils.formatEther(await contracts.sourceToken.balanceOf(memberA.address))
    expect(sourceBalance).to.equal("0.0")

    // try claim creditFees as creditOperator
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    await (
      await contracts.creditFeeManager
        .connect(creditOperator)
        .distributeFees(contracts.RSD.address, [memberA.address])
    ).wait()

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(creditOperator.address)
    )
    expect(sourceBalance).to.equal("0.0")

    sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(contracts.creditPool.address)
    )
    expect(sourceBalance).to.equal("300.0")

    expect(ethers.utils.formatEther(await contracts.creditPool.totalSupply())).to.eql("200.0") // total staked should be 200

    await contracts.sourceToken.balanceOf(contracts.creditPool.address) // total in pool
  })
  it("create, use, and claim reward fees for credit line with SOURCE at .50cents", async function () {
    await (await contracts.priceOracle.setPrice(500)).wait()

    // Add two members
    await (await contracts.networkRoles.grantMember(memberA.address)).wait()
    await (await contracts.networkRoles.grantMember(memberB.address)).wait()

    const creditLimitA = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(memberA.address),
      "mwei"
    )

    // request a credit line for memberA as memberA
    await (
      await contracts.creditRequest
        .connect(memberA)
        .createRequest(
          contracts.RSD.address,
          memberA.address,
          ethers.utils.parseUnits("999", "mwei")
        )
    ).wait()

    // update and approve request as request operator
    await (
      await contracts.creditRequest.updateRequestLimit(
        contracts.RSD.address,
        memberA.address,
        ethers.utils.parseUnits("1000", "mwei"),
        true
      )
    ).wait()

    // accept request as underwriter
    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.RSD.address, memberA.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.RSD.creditLimitOf(memberA.address),
      "mwei"
    )

    expect(creditLimit).to.equal("1000.0")

    // send funds from memberA to memberB
    await (
      await contracts.sourceToken.transfer(memberA.address, ethers.utils.parseEther("100"))
    ).wait()
    let sourceBalance = ethers.utils.formatEther(
      await contracts.sourceToken.balanceOf(memberA.address)
    )

    expect(sourceBalance).to.equal("100.0")

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
      await contracts.RSD.connect(memberA).transfer(
        memberB.address,
        ethers.utils.parseUnits("1000", "mwei")
      )
    ).wait()

    sourceBalance = ethers.utils.formatEther(await contracts.sourceToken.balanceOf(memberA.address))
    expect(sourceBalance).to.equal("50.0")

    // try claim creditFees as creditOperator
    await (await contracts.creditRoles.grantOperator(creditOperator.address)).wait()
    await (
      await contracts.creditFeeManager
        .connect(creditOperator)
        .distributeFees(contracts.RSD.address, [memberA.address])
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
