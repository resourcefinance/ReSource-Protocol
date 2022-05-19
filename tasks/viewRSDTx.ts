import { task } from "hardhat/config"

const fs = require("fs")

const txHash = "0x2719bd5f5324ea76c87e47b6d493121e09bac26636f7f3f28fc3e92c43c38a82"

task("viewRSDTx", "view RSD tx").setAction(async (_, { ethers, network }) => {
  const signer = (await ethers.getSigners())[0]

  const transaction = await signer.provider?.getTransaction(txHash)

  if (!transaction) return

  const RSDFactory = await ethers.getContractFactory("RSD")

  const contractTx = RSDFactory.interface.parseTransaction({
    data: transaction.data,
    value: transaction.value,
  })

  const RSDDeploymentPath = `./deployments/${network.name}/RSD.json`
  const RSDDeployment = fs.readFileSync(RSDDeploymentPath).toString()
  const RSDAddress = JSON.parse(RSDDeployment)["address"]

  const RSD = new ethers.Contract(RSDAddress, RSDFactory.interface, signer)

  console.log(ethers.utils.formatUnits(contractTx.args["amount"], "mwei"))
  console.log(
    "balance: ",
    ethers.utils.formatUnits(await RSD.balanceOf(contractTx.args.to), "mwei")
  )

  if (contractTx.name != "transfer") throw new Error("invalid transaction")

  const tx = await signer.provider?.getTransaction(txHash)

  console.log(tx?.from)

  console.log(tx?.blockNumber)

  console.log(contractTx.name)
  console.log(contractTx.args)
})
