import { task } from "hardhat/config"
const fs = require("fs")

import { TASK_UNPAUSE_RSD } from "./task-names"

task(TASK_UNPAUSE_RSD, "unpauseRSD transaction fees").setAction(async (_, { ethers, network }) => {
  const deploymentPath = `./deployments/${network.name}/RSD.json`
  const RSDDeployment = fs.readFileSync(deploymentPath).toString()
  const RSDAddress = JSON.parse(RSDDeployment)["address"]

  if (!RSDAddress) throw new Error("RSD not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const RSDFactory = await ethers.getContractFactory("RSD")

  const RSD = new ethers.Contract(RSDAddress, RSDFactory.interface, signer)

  try {
    await (await RSD.unpause()).wait()
    console.log("RSD transactions fees unpaused")
  } catch (e) {
    console.log(e)
  }
})
