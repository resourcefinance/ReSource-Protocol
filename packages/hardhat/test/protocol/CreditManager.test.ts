import { upgrades, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { protocolFactory, ProtocolContracts } from "./protocolFactory"
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils"
import fs from "fs"
import { CreditManager, CreditPool } from "../../types"

chai.use(solidity)

describe("CreditRequest and CreditManager Tests", function() {
  let deployer: SignerWithAddress
  let contracts: ProtocolContracts
  let underwriter: SignerWithAddress
  let network: SignerWithAddress
  let requestOpperator: SignerWithAddress
  let ambassador: SignerWithAddress
  let member: SignerWithAddress

  this.beforeEach(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    underwriter = accounts[1]
    network = accounts[2]
    requestOpperator = accounts[3]
    ambassador = accounts[4]
    member = accounts[5]
    contracts = await protocolFactory.deployDefault(underwriter.address)
    await (await contracts.creditRoles.grantNetwork(contracts.rUSD.address)).wait()
  })

  it("Create, approve, and accept a new credit request as operator", async function() {
    await (await contracts.creditRoles.grantRequestOperator(underwriter.address)).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .createRequest(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )

    expect(poolCreditLimit).to.equal("100.0")
    expect(creditLimit).to.equal("100.0")
  })

  it("Update and accept a request", async function() {
    await (await contracts.creditRoles.grantRequestOperator(underwriter.address)).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .createRequest(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .updateRequestLimit(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("150", "mwei"),
          true
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )
    expect(poolCreditLimit).to.equal("150.0")
    expect(creditLimit).to.equal("150.0")
  })

  it("Create request as member approve as request operator and accept as underwriter", async function() {
    await (await contracts.creditRoles.grantRequestOperator(requestOpperator.address)).wait()

    await (
      await contracts.creditRequest
        .connect(member)
        .createRequest(
          contracts.rUSD.address,
          member.address,
          ethers.utils.parseUnits("100", "mwei")
        )
    ).wait()

    await (
      await contracts.creditRequest
        .connect(requestOpperator)
        .approveRequest(contracts.rUSD.address, member.address)
    ).wait()

    await (
      await contracts.creditRequest
        .connect(underwriter)
        .acceptRequest(contracts.rUSD.address, member.address, contracts.creditPool.address)
    ).wait()

    const creditLimit = ethers.utils.formatUnits(
      await contracts.rUSD.creditLimitOf(member.address),
      "mwei"
    )

    const poolCreditLimit = ethers.utils.formatUnits(
      await contracts.creditPool.getTotalCredit(),
      "mwei"
    )

    expect(poolCreditLimit).to.equal("100.0")
    expect(creditLimit).to.equal("100.0")
  })

  it("calculates minLTV & ltv", async function() {
    const reward = parseEther("8000")
    const creditDeploy = `./deployments/localhost/CreditManager.json`
    const creditPath = fs.readFileSync(creditDeploy).toString()
    const creditAddr = JSON.parse(creditPath)["address"]

    const poolDeploy = `./deployments/localhost/CreditPool.json`
    const poolPath = fs.readFileSync(poolDeploy).toString()
    const poolAddr = JSON.parse(poolPath)["address"]

    const networkDeploy = `./deployments/localhost/RUSD.json`
    const networkPath = fs.readFileSync(networkDeploy).toString()
    const networkAddr = JSON.parse(networkPath)["address"]
    const signer = (await ethers.getSigners())[0]

    const creditFactory = await ethers.getContractFactory("CreditManager")
    const credit = new ethers.Contract(creditAddr, creditFactory.interface, signer) as CreditManager
    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

    try {
      await (await contracts.sourceToken.transfer(underwriter.address, reward)).wait()

      await (
        await pool
          .connect(underwriter)
          .addReward(contracts.sourceToken.address, underwriter.address, 60 * 60 * 60)
      ).wait()

      await (
        await contracts.sourceToken
          .connect(underwriter)
          .approve(pool.address, ethers.constants.MaxUint256)
      ).wait()

      await (
        await pool.connect(underwriter).notifyRewardAmount(contracts.sourceToken.address, reward)
      ).wait()

      await (await contracts.sourceToken.transfer(member.address, reward)).wait()
      await (
        await contracts.sourceToken
          .connect(member)
          .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
      ).wait()

      await (await contracts.creditPool.connect(member).stake(parseEther("6000"))).wait()

      const min = await contracts.creditManager.minLTV()

      await (
        await contracts.creditPool
          .connect(deployer)
          .increaseTotalCredit(parseUnits("50000", "mwei"))
      ).wait()

      const creditAfter = await contracts.creditPool.getTotalCredit()
      const minAfter = await contracts.creditManager.minLTV()
      const ltvAfter = await contracts.creditManager.calculatePoolLTV(
        contracts.rUSD.address,
        contracts.creditPool.address
      )

      log("min: ", formatUnits(minAfter, "mwei"))
      log("ltv: ", formatUnits(ltvAfter, "mwei"))

      /* assume price of SOURCE == $1USD 20% of $1000rUSD == ~$200 SOURCE */
      // expect(formatUnits(creditAfter, "mwei")).to.equal("1000.0")
      // expect(formatUnits(ltvAfter, "mwei")).to.equal("0.2")
      // expect(formatUnits(minAfter, "mwei")).to.equal(formatUnits(min, "mwei"))
    } catch (e) {
      console.log(e)
    }
  })
})

const log = (...args) => console.log(...args)
