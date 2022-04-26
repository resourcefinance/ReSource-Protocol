import { task } from "hardhat/config"
import { RUSD__factory } from "../types/factories/RUSD__factory"
const fs = require("fs")

const txHash = "0x2719bd5f5324ea76c87e47b6d493121e09bac26636f7f3f28fc3e92c43c38a82"

task("viewRUSDTx", "view rusd tx").setAction(async (_, { ethers, network }) => {
  const signer = (await ethers.getSigners())[0]

  const transaction = await signer.provider?.getTransaction(txHash)

  if (!transaction) return

  const rUSDInterface = new ethers.utils.Interface(RUSD__factory.abi)

  const parsedTx = rUSDInterface.parseTransaction({
    data: transaction.data,
    value: transaction.value,
  })

  console.log(parsedTx)

  const rUSDDeploymentPath = `./deployments/${network.name}/RUSD.json`
  const rUSDDeployment = fs.readFileSync(rUSDDeploymentPath).toString()
  const rUSDAddress = JSON.parse(rUSDDeployment)["address"]

  const rUSDFactory = await ethers.getContractFactory("RUSD")

  const rUSD = new ethers.Contract(rUSDAddress, rUSDFactory.interface, signer)

  console.log(ethers.utils.formatUnits(parsedTx.args["amount"], "mwei"))
  console.log(
    "balance: ",
    ethers.utils.formatUnits(await rUSD.balanceOf(parsedTx.args["to"]), "mwei")
  )

  if (parsedTx.name != "transfer") throw new Error("invalid transaction")

  console.log(parsedTx.name)
  console.log(parsedTx.args)
})
