import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"

chai.use(solidity)

describe("CreditFeeManager Tests", function() {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let creditOpperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let member: SignerWithAddress

  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    creditOpperator = accounts[3]
    ambassador = accounts[4]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
  })

  it("Collects and claim fees from member", async function() {
    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("100"))
    ).wait()

    expect(await contracts.sourceToken.balanceOf(member.address)).to.equal(
      ethers.utils.parseEther("100.0"),
    )

    await (await contracts.creditRoles.grantNetwork(network.address)).wait()

    await await contracts.sourceToken
      .connect(member)
      .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)

    await (
      await contracts.creditFeeManager
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

    await (await contracts.creditRoles.grantOperator(creditOpperator.address)).wait()

    expect(await contracts.sourceToken.balanceOf(creditOpperator.address)).to.equal(
      ethers.utils.parseEther("0.0"),
    )

    await (
      await contracts.creditFeeManager
        .connect(creditOpperator)
        .claimOperatorFees(contracts.rUSD.address, [member.address])
    ).wait()

    expect(await contracts.sourceToken.balanceOf(creditOpperator.address)).to.equal(
      ethers.utils.parseEther("100.0"),
    )
  })

  it("Collecting reverts from insufficient source balance", async function() {
    await (
      await contracts.sourceToken.transfer(member.address, ethers.utils.parseEther("99"))
    ).wait()

    expect(await contracts.sourceToken.balanceOf(member.address)).to.equal(
      ethers.utils.parseEther("99.0"),
    )

    await await contracts.sourceToken
      .connect(member)
      .approve(contracts.creditFeeManager.address, ethers.constants.MaxUint256)

    await expect(
      contracts.creditFeeManager
        .connect(network)
        .collectFees(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("1000", "mwei"),
        ),
    ).to.be.reverted
  })
})
