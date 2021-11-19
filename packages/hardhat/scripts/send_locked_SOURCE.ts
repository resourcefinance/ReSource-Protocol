import { config, deployments, ethers, network } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

const fs = require("fs")
const recipientsFile = "./scripts/recipients.json"
const transferPath = "./transfers_SOURCE/"

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

  let transferFile = transferPath + network.name + `/${recipients.fileName}.json`
  if (!fs.existsSync(transferFile)) fs.writeFileSync(transferFile, JSON.stringify({}, null, 2))
  let transfers = fs.readFileSync(transferFile).toString()
  transfers = JSON.parse(transfers)

  const sourceTokenAddress = (await deployments.getOrNull("SourceToken"))?.address
  console.log(sourceTokenAddress)

  if (!sourceTokenAddress) throw new Error("token not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const sourceContract = new ethers.Contract(
    sourceTokenAddress,
    SourceToken__factory.createInterface(),
    signer,
  ) as SourceToken

  const addresses = recipients.recipients
  let schedules
  for (let recipient of addresses) {
    try {
      const address = recipient.address

      if (!ethers.utils.isAddress(recipient.address)) throw Error("Invalid address")

      if (transfers[address] && transfers[address].isSuccess) {
        console.log("✅ Transfer already sent to " + address)
        continue
      }

      const amount = ethers.utils.parseEther(recipient.amount)
      schedules = getSchedule(Number(recipient.amount))

      console.log("💵 Sending " + ethers.utils.formatEther(amount) + " locked SOURCE to " + address)

      const tx = await (
        await sourceContract.transferWithLock(address, {
          totalAmount: amount,
          amountStaked: 0,
          schedules: schedules,
        })
      ).wait()

      transfers[recipient.address] = {
        name: recipient.name,
        vc: recipient.vc,
        email: recipient.email,
        amount: recipient.amount,
        txHash: tx.transactionHash,
        schedules: parseSchedule(schedules),
        isSuccess: true,
        error: "",
      }
      fs.writeFileSync(transferFile, JSON.stringify(transfers, null, 2))
    } catch (e) {
      transfers[recipient.address] = {
        name: recipient.name,
        amount: recipient.amount,
        schedules: schedules,
        txHash: "",
        isSuccess: false,
        error: (e as any).message,
      }
      fs.writeFileSync(transferFile, JSON.stringify(transfers, null, 2))
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

const getSchedule = (amount: number) => {
  const days = 86400
  const month = days * 31
  const startDate = new Date("Thu Nov 21 2021 22:10:00 GMT-0800 (Pacific Standard Time)")
  const startTimeStamp = Date.parse(startDate.toString()) / 1000
  const startFromPause = startTimeStamp + month * 4

  const arr = new Array()
  arr.push({
    amount: ethers.utils.parseEther((amount * 0.2).toString()),
    expirationBlock: startTimeStamp,
  })
  for (let i = 0; i < 16; i++) {
    arr.push({
      amount: ethers.utils.parseEther((amount * 0.05).toString()),
      expirationBlock: startFromPause + month * i,
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
