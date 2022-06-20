import { task } from "hardhat/config"
import { addr, debug } from "../hardhat.config"
const fs = require("fs")

import { TASK_REVOKEAPIROLES } from "./task-names"

task(TASK_REVOKEAPIROLES, "revoke request operator")
  .addParam("address", "Address to grant api roles")
  .setAction(async (taskArgs, { ethers, network }) => {
    const creditDeploymentPath = `./deployments/${network.name}/CreditRoles.json`
    const creditRolesDeployment = fs.readFileSync(creditDeploymentPath).toString()
    const creditRolesAddress = JSON.parse(creditRolesDeployment)["address"]

    if (!creditRolesAddress) throw new Error("credit roles not deployed on this network")

    const networkDeploymentPath = `./deployments/${network.name}/NetworkRoles.json`
    const networkRolesDeployment = fs.readFileSync(networkDeploymentPath).toString()
    const networkRolesAddress = JSON.parse(networkRolesDeployment)["address"]

    if (!networkRolesAddress) throw new Error("network roles not deployed on this network")

    const apiAddress = await addr(ethers, taskArgs.address)
    debug(`Normalized to address: ${apiAddress}`)
    const signer = (await ethers.getSigners())[0]

    const creditRolesFactory = await ethers.getContractFactory("CreditRoles")

    const creditRoles = new ethers.Contract(
      creditRolesAddress,
      creditRolesFactory.interface,
      signer
    )

    const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")

    const networkRoles = new ethers.Contract(
      networkRolesAddress,
      networkRolesFactory.interface,
      signer
    )

    try {
      await (await creditRoles.revokeRequestOperator(apiAddress)).wait()
      await (await creditRoles.revokeUnderwriter(apiAddress)).wait()
      await (await networkRoles.revokeOperator(apiAddress)).wait()
      console.log("🚀 API roles revoked")
    } catch (e) {
      console.log(e)
    }
  })
