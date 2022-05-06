import { task } from "hardhat/config"
import { addr, debug } from "../hardhat.config"
const fs = require("fs")

import { TASK_SENDSOURCE } from "./task-names"

task(TASK_SENDSOURCE, "Send SOURCE")
  .addParam("to", "Address to send SOURCE to ")
  .addParam("amount", "Amount of Source to send to to address")
  .setAction(async (taskArgs, { ethers, network }) => {
    const deploymentPath = `./deployments/${network.name}/SourceToken.json`
    const ReSourceTokenDeployment = fs.readFileSync(deploymentPath).toString()
    const ReSourceTokenAddress = JSON.parse(ReSourceTokenDeployment)["address"]

    if (!ReSourceTokenAddress) throw new Error("token not deployed on this network")

    const to = await addr(ethers, taskArgs.to)
    const amount = ethers.utils.parseEther(taskArgs.amount)
    debug(`Normalized to address: ${to}`)
    const signer = (await ethers.getSigners())[0]

    const SourceTokenFactory = await ethers.getContractFactory("SourceToken")

    const tokenContract = new ethers.Contract(
      ReSourceTokenAddress,
      SourceTokenFactory.interface,
      signer
    )

    try {
      await (await tokenContract.transfer(to, amount)).wait()
      console.log("Funds transfered")
    } catch (e) {
      console.log(e)
    }
  })
