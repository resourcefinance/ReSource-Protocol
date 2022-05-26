import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"
import { recoverTypedSignature, signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util"
import { Wallet } from "ethers"
import { hexValue } from "ethers/lib/utils"

chai.use(solidity)

describe("Forwarder Tests", function () {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let memberA: Wallet
  let memberB: SignerWithAddress
  let privateKey = "c429601ee7a6167356f15baa70fd8fe17b0325dab7047a658a31039e5384bffd"
  const privateKeyBuffer = Buffer.from(privateKey, "hex")

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    memberA = new Wallet(privateKey).connect(ethers.provider)
    memberB = accounts[3]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.RSD.address)).wait()
  })

  it("Forwards RSD tx", async function () {
    await (await contracts.RSD.pause()).wait()
    await (
      await deployer.sendTransaction({ to: memberA.address, value: ethers.utils.parseEther("10") })
    ).wait()
    await (await contracts.networkRoles.grantMember(memberA.address)).wait()
    await (await contracts.networkRoles.grantMember(memberB.address)).wait()

    // request a credit line for memberA as memberA
    await (
      await contracts.creditRequest
        .connect(memberA)
        .createRequest(
          contracts.RSD.address,
          memberA.address,
          ethers.utils.parseUnits("1000", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest.approveRequest(contracts.RSD.address, memberA.address)
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

    const { data } = await contracts.RSD.populateTransaction.transfer(
      memberB.address,
      ethers.utils.parseUnits("1000", "mwei")
    )

    const gas = await contracts.RSD.connect(memberA).estimateGas.transfer(
      memberB.address,
      ethers.utils.parseUnits("1000", "mwei")
    )

    expect(Number(ethers.utils.formatUnits(gas, "wei"))).to.be.greaterThan(0)

    if (!data) return

    const typedData = {
      domain: {
        chainId: network.config.chainId,
        name: "MinimalForwarder",
        version: "0.0.1",
        verifyingContract: contracts.minimalForwarder.address,
      },

      message: {
        from: memberA.address,
        to: contracts.RSD.address,
        value: hexValue(0),
        gas: 1,
        nonce: hexValue(0),
        data,
      },
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        ForwardRequest: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "gas", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      primaryType: "ForwardRequest" as any,
    }

    const sig = signTypedData({
      privateKey: privateKeyBuffer,
      data: typedData,
      version: SignTypedDataVersion.V4,
    })

    expect(sig).to.not.be.null

    expect(await contracts.minimalForwarder.verify(typedData.message, sig)).to.be.true

    await (await contracts.minimalForwarder.execute(typedData.message, sig)).wait()

    const balanceB = ethers.utils.formatUnits(
      await contracts.RSD.balanceOf(memberB.address),
      "mwei"
    )

    expect(balanceB).to.equal("1000.0")
  })
})
