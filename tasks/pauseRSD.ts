import { task } from "hardhat/config"
const fs = require("fs")

import { TASK_PAUSE_RSD } from "./task-names"

task(TASK_PAUSE_RSD, "pause RSD transaction fees").setAction(async (_, { ethers, network }) => {
  const deploymentPath = `./deployments/${network.name}/RSD.json`
  const _RSDDeployment = fs.readFileSync(deploymentPath).toString()
  const _RSDAddress = JSON.parse(_RSDDeployment)["address"]

  if (!_RSDAddress) throw new Error("RSD not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const _RSDFactory = await ethers.getContractFactory("RSD")

  const _RSD = new ethers.Contract(_RSDAddress, _RSDFactory.interface, signer)

  try {
    await (await _RSD.pause()).wait()
    console.log("RSD transactions fees paused")
  } catch (e) {
    console.log(e)
  }
})
