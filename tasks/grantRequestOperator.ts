import { task } from "hardhat/config"
import { addr, debug } from "../hardhat.config"
const fs = require("fs")

import { TASK_GRANTREQUESTOPERATOR } from "./task-names"

task(TASK_GRANTREQUESTOPERATOR, "grant request operator")
  .addParam("address", "Address to grant request operator")
  .setAction(async (taskArgs, { ethers, network }) => {
    const deploymentPath = `./deployments/${network.name}/CreditRoles.json`
    const creditRolesDeployment = fs.readFileSync(deploymentPath).toString()
    const creditRolesAddress = JSON.parse(creditRolesDeployment)["address"]

    if (!creditRolesAddress) throw new Error("credit roles not deployed on this network")

    const requestAddress = await addr(ethers, taskArgs.address)
    debug(`Normalized to address: ${requestAddress}`)
    const signer = (await ethers.getSigners())[0]

    const creditRolesFactory = await ethers.getContractFactory("CreditRoles")

    const creditRoles = new ethers.Contract(
      creditRolesAddress,
      creditRolesFactory.interface,
      signer
    )

    try {
      await (await creditRoles.grantRequestOperator(requestAddress)).wait()
      console.log("Request Operator Granted")
    } catch (e) {
      console.log(e)
    }
  })
