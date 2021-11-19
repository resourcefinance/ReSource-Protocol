import { config, deployments, ethers, network } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

const fs = require("fs")
const recipientsFile = "./scripts/recipients.json"
const transferPath = "./transfers_celo/"

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

  let transferFile = transferPath + network.name + `/${recipients.name}.json`
  if (fs.existsSync(transferFile)) {
    throw Error("transfer file with name already exists")
  }

  const addresses = recipients.recipients
  let transfers = {}
  const signer = (await ethers.getSigners())[0]

  try {
    for (let recipient of addresses) {
      const tx = {
        to: recipient.address,
        value: ethers.utils.parseEther(recipient.amount),
      }

      console.log("💵 Sending " + ethers.utils.formatEther(tx.value) + " Celo to " + tx.to)

      const transaction = await (await signer.sendTransaction(tx)).wait()

      transfers[recipient.address] = {
        name: recipient.name,
        amount: recipient.amount,
        txHash: transaction.transactionHash,
      }
      fs.writeFileSync(transferFile, JSON.stringify(transfers, null, 2))
    }
  } catch (e) {
    console.log(e)
  }
  console.log("funds transfered")
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })

const formatLock = (lockSchedule) => {
  return lockSchedule.map((schedule) => {
    return {
      amount: ethers.utils.parseEther(schedule.amount),
      expirationBlock: Date.parse(schedule.expirationDateTime) / 1000,
    }
  })
}
