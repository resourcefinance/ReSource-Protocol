import { ethers, network } from "hardhat"
import { RestrictedCreditPool } from "../types/RestrictedCreditPool"
import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper"

const fs = require("fs")
const restrictedFile = "./scripts/recipients.json"

async function main(): Promise<void> {
  if (!fs.existsSync(restrictedFile)) {
    throw Error("restricted file not found")
  }

  const walletPk = "0xf35a5149054286f6c2f4ccedd1ad24fec0848c37198944b23d469da282572b61"

  const provider = new CeloProvider("https://forno.celo.org")
  const wallet = new CeloWallet(walletPk, provider)

  let addresses = fs.readFileSync(restrictedFile).toString()
  addresses = JSON.parse(addresses)

  let pool = (await ethers.getContract("RestrictedCreditPool")) as RestrictedCreditPool

  pool = pool.connect(wallet)

  if (!pool.address) throw new Error("token not deployed on this network")

  console.log("Connected to pool: ", pool.address)

  let count = 0
  for (let address of addresses) {
    try {
      count++
      if (!ethers.utils.isAddress(address)) throw Error("Invalid address")

      const restricted = await pool.isRestricted(address)

      if (restricted) {
        console.log("✅ ", address, " already restricted. (", count, " / ", addresses.length, ")")
        continue
      }

      await (await pool.addRestriction(address)).wait()

      console.log("🚀 ", address, " restricted (", count, " / ", addresses.length, ")")
    } catch (e) {
      console.log("❌ error restricting ", address, "(", count, " / ", addresses.length, ")")
      console.log(e)
    }
  }

  console.log("addresses restricted")
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error)
    process.exit(1)
  })
