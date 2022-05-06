import { task } from "hardhat/config"
import { addr, debug } from "../hardhat.config"
const fs = require("fs")

import { VIEW_SOURCE_LOCK } from "./task-names"

task(VIEW_SOURCE_LOCK, "View SOURCE Lock")
  .addParam("address", "Address to view SOURCE lock")
  .setAction(async (taskArgs, { ethers, network }) => {
    const deploymentPath = `./deployments/${network.name}/SourceToken.json`
    const ReSourceTokenDeployment = fs.readFileSync(deploymentPath).toString()
    const ReSourceTokenAddress = JSON.parse(ReSourceTokenDeployment)["address"]

    if (!ReSourceTokenAddress) throw new Error("token not deployed on this network")

    const address = await addr(ethers, taskArgs.address)
    debug(`Normalized to address: ${address}`)
    const signer = (await ethers.getSigners())[0]

    const SourceTokenFactory = await ethers.getContractFactory("SourceTokenV3")

    const tokenContract = new ethers.Contract(
      ReSourceTokenAddress,
      SourceTokenFactory.interface,
      signer
    )

    try {
      const schedules = await tokenContract.getLockSchedules(address)
      console.log("Locks:")
      console.log(schedules)
    } catch (e) {
      console.log(e)
    }
  })
