import { BigNumber } from "@ethersproject/bignumber"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import chai, { expect } from "chai"
import { solidity } from "ethereum-waffle"
import { formatEther, parseEther } from "ethers/lib/utils"
import { ethers, upgrades, network } from "hardhat"

import { RewardAddedEvent } from "../../types/CreditPool"
import { ProtocolContracts, protocolFactory } from "./protocolFactory"
import { RestrictedCreditPoolV2 } from "../../types/RestrictedCreditPoolV2"
import { RestrictedCreditPoolV2__factory } from "../../types/factories/RestrictedCreditPoolV2__factory"

chai.use(solidity)

describe("RestrictedCreditPoolV2 update active rewards duration test", function () {
  let contracts: ProtocolContracts
  let deployer: SignerWithAddress
  let underwriter: SignerWithAddress
  let member: SignerWithAddress
  let member2: SignerWithAddress
  let poolV2: RestrictedCreditPoolV2

  this.beforeEach(async function () {
    const accounts = await ethers.getSigners()

    deployer = accounts[0]
    underwriter = accounts[1]
    member = accounts[5]
    member2 = accounts[6]

    contracts = await protocolFactory.deployDefault(underwriter.address)

    const poolV2Factory = await ethers.getContractFactory("RestrictedCreditPoolV2")

    const v1 = await contracts.creditPool
    await upgrades.upgradeProxy(v1.address, poolV2Factory)
    poolV2 = RestrictedCreditPoolV2__factory.connect(v1.address, underwriter)
  })

  it("Adds notifies and updates pool rewards", async function () {
    await (
      await contracts.sourceToken.transfer(underwriter.address, ethers.utils.parseEther("1000"))
    ).wait()

    expect(await contracts.creditPool.rewardTokens(0)).to.equal(contracts.sourceToken.address)

    await (
      await contracts.sourceToken
        .connect(underwriter)
        .approve(contracts.creditPool.address, ethers.constants.MaxUint256)
    ).wait()

    await (
      await contracts.creditPool
        .connect(underwriter)
        .notifyRewardAmount(contracts.sourceToken.address, ethers.utils.parseEther("100"))
    ).wait()

    const rewardAdded = (
      await contracts.creditPool.queryFilter(contracts.creditPool.filters.RewardAdded())
    )[0] as RewardAddedEvent

    expect(rewardAdded).to.exist
    expect(rewardAdded.event).to.equal("RewardAdded")

    let rewardData = await poolV2.rewardData(contracts.sourceToken.address)
    let rewardRate = ethers.utils.formatUnits(rewardData.rewardRate, "wei")
    let rewardsDuration = ethers.utils.formatUnits(rewardData.rewardsDuration, "wei")
    let periodFinish = ethers.utils.formatUnits(rewardData.periodFinish, "wei")

    expect(rewardRate).to.equal("12860082304526")
    expect(rewardsDuration).to.equal("7776000")
    let currentBlock = (
      await deployer.provider?.getBlock(await deployer.provider?.getBlockNumber())
    )?.timestamp!

    expect(periodFinish).to.equal((currentBlock + 7776000).toString())

    await poolV2.updateActiveRewardsDuration(contracts.sourceToken.address, 15552000)

    rewardData = await poolV2.rewardData(contracts.sourceToken.address)
    rewardRate = ethers.utils.formatUnits(rewardData.rewardRate, "wei")
    rewardsDuration = ethers.utils.formatUnits(rewardData.rewardsDuration, "wei")
    periodFinish = ethers.utils.formatUnits(rewardData.periodFinish, "wei")

    expect(rewardRate).to.equal("6430041152263")
    expect(rewardsDuration).to.equal("15552000")
    currentBlock = (await deployer.provider?.getBlock(await deployer.provider?.getBlockNumber()))
      ?.timestamp!

    expect(periodFinish).to.equal((currentBlock + 15552000 - 1).toString())
  })
})
