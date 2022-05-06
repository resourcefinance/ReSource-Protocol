import { task } from "hardhat/config"
const fs = require("fs")

import { TASK_UNPAUSERUSD } from "./task-names"

task(TASK_UNPAUSERUSD, "unpauseRUSD transaction fees").setAction(async (_, { ethers, network }) => {
  const deploymentPath = `./deployments/${network.name}/RUSD.json`
  const rUSDDeployment = fs.readFileSync(deploymentPath).toString()
  const rUSDAddress = JSON.parse(rUSDDeployment)["address"]

  if (!rUSDAddress) throw new Error("rUSD not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const rUSDFactory = await ethers.getContractFactory("RUSD")

  const rUSD = new ethers.Contract(rUSDAddress, rUSDFactory.interface, signer)

  try {
    await (await rUSD.unpause()).wait()
    console.log("rUSD transactions fees unpaused")
  } catch (e) {
    console.log(e)
  }
})
