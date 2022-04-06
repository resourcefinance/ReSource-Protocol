import { CeloProvider } from "@celo-tools/celo-ethers-wrapper"
import { task } from "hardhat/config"
const fs = require("fs")

import { TASK_INITRUSDMIGRATION } from "./task-names"

task(TASK_INITRUSDMIGRATION, "Initialize rUSD migration").setAction(
  async (_, { ethers, network }) => {
    const rUSDFactory = await ethers.getContractFactory("RUSD")
    const testnetRUSD = new ethers.Contract(
      "0x3D8711853fCA5B033C7ca228d931bd90F474203F",
      rUSDFactory.interface,
      new CeloProvider("https://alfajores-forno.celo-testnet.org")
    )
    const migrationSupply = await testnetRUSD.totalSupply()

    const deploymentPath = `./deployments/${network.name}/RUSD.json`
    const rUSDDeployment = fs.readFileSync(deploymentPath).toString()
    const rUSDAddress = JSON.parse(rUSDDeployment)["address"]

    if (!rUSDAddress) throw new Error("rUSD not deployed on this network")

    const signer = (await ethers.getSigners())[0]

    const rUSD = new ethers.Contract(rUSDAddress, rUSDFactory.interface, signer)

    // 1. initialize migration
    await (await rUSD.initializeMigration(migrationSupply)).wait()
  }
)
