import { config, deployments, ethers, network } from "hardhat"
import { SourceToken, SourceToken__factory } from "../types"

const fs = require("fs")
const recipientsFile = "./scripts/recipients.json"
const transferPath = "./tx_receipts/transfers_celo/"

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

  const addresses = recipients.recipients
  const signer = (await ethers.getSigners())[0]

  for (let recipient of addresses) {
    try {
      const address = recipient.address

      if (!ethers.utils.isAddress(recipient.address)) throw Error("Invalid address")

      if (transfers[address] && transfers[address].isSuccess) {
        console.log("✅ Transfer already sent to " + address)
        continue
      }

      const tx = {
        to: recipient.address,
        value: ethers.utils.parseEther(recipient.amount),
      }

      console.log("💵 Sending " + ethers.utils.formatEther(tx.value) + " Celo to " + tx.to)

      const transaction = await (await signer.sendTransaction(tx)).wait()

      transfers[recipient.address] = {
        name: recipient.name,
        vc: recipient.vc,
        email: recipient.email,
        amount: recipient.amount,
        txHash: transaction.transactionHash,
        isSuccess: true,
        error: "",
      }
      fs.writeFileSync(transferFile, JSON.stringify(transfers, null, 2))
    } catch (e) {
      transfers[recipient.address] = {
        name: recipient.name,
        vc: recipient.vc,
        email: recipient.email,
        amount: recipient.amount,
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

const formatLock = (lockSchedule) => {
  return lockSchedule.map((schedule) => {
    return {
      amount: ethers.utils.parseEther(schedule.amount),
      expirationBlock: Date.parse(schedule.expirationDateTime) / 1000,
    }
  })
}
