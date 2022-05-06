import { task } from "hardhat/config"
import { GRANT_MEMBER } from "./task-names"
import fs from "fs"
import { addr } from "../hardhat.config"

task(GRANT_MEMBER, "Grant membership")
  .addParam("member", "Address to grant membership")
  .setAction(async (taskArgs, { ethers, network }) => {
    const networkRolesDeploymentPath = `./deployments/${network.name}/NetworkRoles.json`
    const networkRolesDeployment = fs.readFileSync(networkRolesDeploymentPath).toString()
    const networkRolesAddress = JSON.parse(networkRolesDeployment)["address"]

    if (!networkRolesAddress) throw new Error("contracts not deployed on this network")

    const member = await addr(ethers, taskArgs.member)
    const signer = (await ethers.getSigners())[0]

    const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")

    const networkRoles = new ethers.Contract(
      networkRolesAddress,
      networkRolesFactory.interface,
      signer
    )

    try {
      if (!(await networkRoles.isMember(member))) {
        await (await networkRoles.grantMember(member)).wait()
      }

      console.log("membership granted")
    } catch (e) {
      console.log(e)
    }
  })
