import { BigNumber } from "ethers"
import { config, deployments, ethers, network } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"
import { TokenClaim__factory } from "../types/factories/TokenClaim__factory"
import { TokenClaim } from "../types/TokenClaim"

const fs = require("fs")
const recipientsFile = "./scripts/recipients.json"
const transferPath = "./tx_receipts/claims_SOURCE/"

async function main(): Promise<void> {
  if (!fs.existsSync(recipientsFile)) {
    throw Error("recipients file not found")
  }
  if (!fs.existsSync(transferPath)) {
    fs.mkdirSync(transferPath)
  }
  if (!fs.existsSync(transferPath + network.name)) {
    fs.mkdirSync(transferPath + network.name)
  }
  let recipients = fs.readFileSync(recipientsFile).toString()
  recipients = JSON.parse(recipients)

  let receiptFile = transferPath + network.name + `/${recipients.fileName}.json`
  if (!fs.existsSync(receiptFile)) fs.writeFileSync(receiptFile, JSON.stringify({}, null, 2))
  let transactions = fs.readFileSync(receiptFile).toString()
  transactions = JSON.parse(transactions)

  const sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address
  console.log("SOURCE address: ", sourceTokenAddress)

  const tokenClaimAddress = (await deployments.getOrNull("TokenClaim"))?.address
  console.log("TokenClaim address: ", tokenClaimAddress)

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")
  if (!tokenClaimAddress) throw new Error("tokenClaim not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const sourceContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    signer,
  ) as SourceToken

  const tokenClaimContract = new ethers.Contract(
    tokenClaimAddress,
    TokenClaim__factory.createInterface(),
    signer,
  ) as TokenClaim

  const addresses = recipients.recipients
  let schedules
  for (let recipient of addresses) {
    try {
      const address = recipient.address

      if (!ethers.utils.isAddress(recipient.address)) throw Error("Invalid address")

      if (transactions[address] && transactions[address].isSuccess) {
        console.log("✅ Transfer already sent to " + address)
        continue
      }

      const lockedAmount = ethers.utils.parseEther(recipient.lockedAmount)
      schedules = getSchedule(
        lockedAmount,
        recipients.schedule.periods,
        recipients.schedule.monthsInPeriod,
        recipients.schedule.startDate,
      )

      console.log("💵 Creating Claim for " + address)

      const tx = await (
        await tokenClaimContract.addClaim(
          address,
          ethers.utils.parseEther(recipient.unlockedAmount),
          {
            totalAmount: lockedAmount,
            amountStaked: 0,
            schedules: schedules,
          },
        )
      ).wait()

      transactions[recipient.address] = {
        name: recipient.name,
        vc: recipient.vc,
        email: recipient.email,
        amount: recipient.amount,
        txHash: tx.transactionHash,
        schedules: parseSchedule(schedules),
        isSuccess: true,
        error: "",
      }
      fs.writeFileSync(receiptFile, JSON.stringify(transactions, null, 2))
    } catch (e) {
      console.log("❌ Tx error")
      console.log(e)
      transactions[recipient.address] = {
        name: recipient.name,
        amount: recipient.amount,
        schedules: parseSchedule(schedules),
        txHash: "",
        isSuccess: false,
        error: (e as any).message,
      }
      fs.writeFileSync(receiptFile, JSON.stringify(transactions, null, 2))
    }
  }
  console.log("funds transfered")
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })

const getSchedule = (amount: BigNumber, periods: number, monthsInPeriod, startDate: Date) => {
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

const parseSchedule = (schedules) => {
  return schedules.map((schedule) => {
    return {
      amount: ethers.utils.formatEther(schedule.amount),
      expirationBlock: schedule.expirationBlock,
      expirationDate: new Date(schedule.expirationBlock * 1000),
    }
  })
}
