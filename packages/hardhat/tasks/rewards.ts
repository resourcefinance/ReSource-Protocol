import { task } from "hardhat/config"
import fs from "fs"

import { SourceTokenV2 } from "../types/SourceTokenV2"
import { CreditPool } from "../types/CreditPool"
import { MockERC20 } from "../types/MockERC20"
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils"
import { SourceTokenV3 } from "../types/SourceTokenV3"
import { BigNumber } from "@ethersproject/bignumber"
import { CreditManager } from "../types/CreditManager"

task("reward", "Add reward to Credit Pool", async ({ amount }, { ethers, network }) => {
  const sourceAmt = parseEther("30000")
  const rewardAmt = parseEther("19000")
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]
  const poolAddr = JSON.parse(poolPath)["address"]

  if (!sourceAddr || !poolAddr) throw new Error("Contracts not deployed on network, check path")

  try {
    const signer = (await ethers.getSigners())[0]
    // Get the pool
    const poolFactory = await ethers.getContractFactory("CreditPool")

    // Get the rewards
    const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
    const ERC20Factory = await ethers.getContractFactory("MockERC20")

    // Deploy "CELO" rewards
    const celoAmt = ethers.utils.parseEther("100000000")
    const MockERC20 = (await ERC20Factory.deploy(celoAmt)) as MockERC20
    // Instantiate the contracts with signer
    const source = new ethers.Contract(sourceAddr, sourceFactory.interface, signer) as SourceTokenV3
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

    // Transfer tokens to signer
    await (await MockERC20.transfer(signer.address, sourceAmt)).wait()
    await (await source.transfer(signer.address, sourceAmt)).wait()

    // Add SOURCE rewwards
    await (await pool.connect(signer).addReward(sourceAddr, signer.address, 90 * 86400)).wait()

    // Add CELO rewwards
    await (
      await pool.connect(signer).addReward(MockERC20.address, signer.address, 90 * 86400)
    ).wait()

    // Approve and notify the rewards
    await (
      await MockERC20.connect(signer).approve(pool.address, ethers.constants.MaxUint256)
    ).wait()
    await (await pool.connect(signer).notifyRewardAmount(MockERC20.address, rewardAmt)).wait()
    await (await source.connect(signer).approve(pool.address, ethers.constants.MaxUint256)).wait()
    await (await pool.connect(signer).notifyRewardAmount(source.address, sourceAmt)).wait()

    log(MockERC20.address)
  } catch (e) {
    console.log(e)
  }
})

task("rewardBalance", "Get balance of credit pool")
  .addOptionalParam("account", "Account to check balance of")
  .setAction(async ({ account }, { ethers, network }) => {
    const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
    const poolDeploy = `./deployments/${network.name}/CreditPool.json`
    const sourcePath = fs.readFileSync(sourceDeploy).toString()
    const poolPath = fs.readFileSync(poolDeploy).toString()
    const sourceAddr = JSON.parse(sourcePath)["address"]
    const poolAddr = JSON.parse(poolPath)["address"]

    if (!sourceAddr || !poolAddr) throw new Error("Contracts not deployed on network, check path")

    try {
      const signer = (await ethers.getSigners())[0]

      const poolFactory = await ethers.getContractFactory("CreditPool")
      const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

      const balance = await pool.earned(account, sourceAddr)

      console.log("earned:", formatEther(balance))
      console.log("rewardToken:", await pool.rewardTokens(0))
      console.log("balanceOf: ", formatEther(await pool.balanceOf(account)))
    } catch (e) {
      console.log(e)
    }
  })

task("advance", "Advance time to accrue rewards")
  .addOptionalParam("amount", "Account to check balance of")
  .setAction(async ({ amount }, { ethers, network }) => {
    const time = amount ?? 60 * 60 * 8
    async function getTimestamp() {
      return (await ethers.provider.getBlock("latest")).timestamp
    }

    async function setBlocktime(newTimestamp) {
      await network.provider.send("evm_mine", [newTimestamp])
    }

    async function advanceTime(seconds) {
      setBlocktime((await getTimestamp()) + seconds)
    }

    try {
      console.log("rewards.ts -- before:", await getTimestamp())
      await advanceTime(time)
      console.log("rewards.ts -- after:", await getTimestamp())
    } catch (e) {
      console.log(e)
    }
  })

task("pool", "Get info on credit pool", async ({ account }, { ethers, network }) => {
  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const poolAddr = JSON.parse(poolPath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]

    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

    const t1 = await pool.rewardTokens(0)
    const t2 = await pool.rewardTokens(1)
    const t3 = await pool.rewardTokens(2)
    const t4 = await pool.rewardTokens(3)

    const d1 = await pool.getRewardForDuration(t4)
    log("d1: ", formatEther(d1))
  } catch (e) {
    console.log(e)
  }
})

task("ltv", "Get LTV", async ({ account }, { ethers, network }) => {
  const creditDeploy = `./deployments/${network.name}/CreditManager.json`
  const creditPath = fs.readFileSync(creditDeploy).toString()
  const creditAddr = JSON.parse(creditPath)["address"]

  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const poolAddr = JSON.parse(poolPath)["address"]

  const networkDeploy = `./deployments/${network.name}/RUSD.json`
  const networkPath = fs.readFileSync(networkDeploy).toString()
  const networkAddr = JSON.parse(networkPath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]
    const creditFactory = await ethers.getContractFactory("CreditManager")
    const credit = new ethers.Contract(creditAddr, creditFactory.interface, signer) as CreditManager
    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

    const ltv = await credit.minLTV()
    const calcd = await credit.calculatePoolLTV(networkAddr, poolAddr)
    const staked = await pool.totalSupply()
    const underwritten = await pool.getTotalCredit()
    log("min: ", formatUnits(ltv, "mwei"))
    log("ltv: ", formatUnits(calcd, "mwei"))
    log("staked: ", formatUnits(staked, "ether"))
    log("credit: ", formatUnits(underwritten, "mwei"))
  } catch (e) {
    console.log(e)
  }
})

task("locked", "Authorize locked SOURCE to be staked", async ({ account }, { ethers, network }) => {
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]
  const poolAddr = JSON.parse(poolPath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]

    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool
    const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
    const source = new ethers.Contract(sourceAddr, sourceFactory.interface, signer) as SourceTokenV2

    await (await source.connect(signer).addStakeableContract(pool.address)).wait()
  } catch (e) {
    console.log(e)
  }
})

task("rewardData", "Get rewardData for contract", async ({ account }, { ethers, network }) => {
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]
  const poolAddr = JSON.parse(poolPath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]

    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool
    const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
    const source = new ethers.Contract(sourceAddr, sourceFactory.interface, signer) as SourceTokenV2

    const token0 = await pool.rewardTokens(0)
    const token1 = await pool.rewardTokens(1)
    const data0 = await pool.rewardData(token0)
    const data1 = await pool.rewardData(token1)
    console.log("rewardToken 1:", data0)
    console.log("rewardToken 2:", data1)
  } catch (e) {
    console.log(e)
  }
})

task("getLocks", "View locks", async ({ account }, { ethers, network }) => {
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]

    const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
    const source = new ethers.Contract(sourceAddr, sourceFactory.interface, signer) as SourceTokenV3

    const locks = await source.getLockSchedules("0xAe021DFd84979719b69e616B0435EC86af87eFa5")
    log("locks: ", locks)
  } catch (e) {
    console.log(e)
  }
})

task("stake", "stake to pool", async ({ account }, { ethers, network }) => {
  const poolDeploy = `./deployments/localhost/CreditPool.json`
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const poolAddr = JSON.parse(poolPath)["address"]
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]

  const signer = (await ethers.getSigners())[0]
  const member = (await ethers.getSigners())[5]

  const poolFactory = await ethers.getContractFactory("CreditPool")
  const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool
  const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
  const source = new ethers.Contract(sourceAddr, sourceFactory.interface, signer) as SourceTokenV3

  try {
    await source.transfer(member.address, parseEther("10000"))
    await (await source.connect(member).approve(pool.address, ethers.constants.MaxUint256)).wait()
    await (await pool.connect(member).stake(parseEther("6000"))).wait()
  } catch (e) {
    log(e)
  }
})

task("credit", "Update total credit", async ({ account }, { ethers, network }) => {
  const poolDeploy = `./deployments/${network.name}/CreditPool.json`
  const poolPath = fs.readFileSync(poolDeploy).toString()
  const poolAddr = JSON.parse(poolPath)["address"]
  const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
  const sourcePath = fs.readFileSync(sourceDeploy).toString()
  const sourceAddr = JSON.parse(sourcePath)["address"]

  try {
    const signer = (await ethers.getSigners())[0]
    const poolFactory = await ethers.getContractFactory("CreditPool")
    const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool

    await (await pool.connect(signer).increaseTotalCredit(parseUnits("100000.0", "mwei"))).wait()

    log("Increase pool.totalCredit to 50000")
  } catch (e) {
    console.log(e)
  }
})

task("stakeBalance", "Get balance staked")
  .addParam("account", "Account to check balance of")
  .setAction(async ({ account }, { ethers, network }) => {
    const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
    const poolDeploy = `./deployments/${network.name}/CreditPool.json`
    const sourcePath = fs.readFileSync(sourceDeploy).toString()
    const poolPath = fs.readFileSync(poolDeploy).toString()
    const sourceAddr = JSON.parse(sourcePath)["address"]
    const poolAddr = JSON.parse(poolPath)["address"]

    if (!sourceAddr || !poolAddr) throw new Error("Contracts not deployed on network, check path")

    try {
      const signer = (await ethers.getSigners())[0]

      const poolFactory = await ethers.getContractFactory("CreditPool")
      const pool = new ethers.Contract(poolAddr, poolFactory.interface, signer) as CreditPool
      const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
      const source = new ethers.Contract(
        sourceAddr,
        sourceFactory.interface,
        signer
      ) as SourceTokenV3

      // const balanceOf = await source.balanceOf(account)
      const lBalanceOf = await source.lockedBalanceOf(account)
      const staked = await pool.balanceOf(account)

      // console.log("source balance:", formatEther(balanceOf))
      console.log("locked balance:", formatEther(lBalanceOf))
      console.log("staked:", formatEther(staked))
    } catch (e) {
      console.log(e)
    }
  })

task("sendLocked", "Send locked SOURCE")
  .addParam("account", "Account to check balance of")
  .setAction(async ({ account }, { ethers, network }) => {
    const sourceDeploy = `./deployments/${network.name}/SourceTokenV3.json`
    const sourcePath = fs.readFileSync(sourceDeploy).toString()
    const sourceAddr = JSON.parse(sourcePath)["address"]

    try {
      const signer = (await ethers.getSigners())[0]

      const sourceFactory = await ethers.getContractFactory("SourceTokenV3")
      const source = new ethers.Contract(
        sourceAddr,
        sourceFactory.interface,
        signer
      ) as SourceTokenV3

      const { recipient, schedule } = {
        recipient: {
          lockedAmount: "1000",
        },
        schedule: {
          startDate: "Monday Nov 21 2022 22:00:00 GMT-0800 (Pacific Standard Time)",
          periods: 1,
          monthsInPeriod: 1,
        },
      }

      const locked = ethers.utils.parseEther(recipient.lockedAmount)
      const parsed = getSchedule(
        locked,
        schedule.periods,
        schedule.monthsInPeriod,
        schedule.startDate
      )

      await (
        await source.transferWithLock(account, {
          totalAmount: locked,
          amountStaked: 0,
          schedules: parsed,
        })
      ).wait()
    } catch (e) {
      console.log(e)
    }
  })

const log = (...args) => console.log(...args)

const getSchedule = (amount: BigNumber, periods: number, monthsInPeriod, startDate: string) => {
  const days = 86400
  const hour = 3600
  const month = days * 30
  let startTimeStamp = Date.parse(startDate.toString()) / 1000

  const arr = new Array()
  for (let i = 0; i < periods; i++) {
    arr.push({
      amount: amount.div(BigNumber.from(periods.toString())),
      expirationBlock: startTimeStamp + month * i * monthsInPeriod,
    })
  }
  return arr
}
