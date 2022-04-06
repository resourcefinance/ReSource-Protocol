import { task } from "hardhat/config"
import { addr, debug } from "../hardhat.config"
const fs = require("fs")

import { TASK_GRANTUNDERWRITER } from "./task-names"

task(TASK_GRANTUNDERWRITER, "grant underwriter")
  .addParam("address", "Address to grant underwriter")
  .setAction(async (taskArgs, { ethers, network }) => {
    const deploymentPath = `./deployments/${network.name}/CreditRoles.json`
    const creditRolesDeployment = fs.readFileSync(deploymentPath).toString()
    const creditRolesAddress = JSON.parse(creditRolesDeployment)["address"]

    if (!creditRolesAddress) throw new Error("credit roles not deployed on this network")

    const underwriterAddress = await addr(ethers, taskArgs.address)
    debug(`Normalized to address: ${underwriterAddress}`)
    const signer = (await ethers.getSigners())[0]

    const creditRolesFactory = await ethers.getContractFactory("CreditRoles")

    const creditRoles = new ethers.Contract(
      creditRolesAddress,
      creditRolesFactory.interface,
      signer
    )

    try {
      await (await creditRoles.grantUnderwriter(underwriterAddress)).wait()
      console.log("Underwriter Granted")
    } catch (e) {
      console.log(e)
    }
  })
