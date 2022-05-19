import { task } from "hardhat/config"
import { ISSUE_CREDIT } from "./task-names"
import fs from "fs"
import { addr } from "../hardhat.config"

task(ISSUE_CREDIT, "Issue RSD credit")
  .addParam("member", "Address to issue credit")
  .addParam("amount", "Amount of credit to issue")
  .setAction(async (taskArgs, { ethers, network }) => {
    const creditRequestDeploymentPath = `./deployments/${network.name}/CreditRequest.json`
    const creditRequestDeployment = fs.readFileSync(creditRequestDeploymentPath).toString()
    const creditRequestAddress = JSON.parse(creditRequestDeployment)["address"]

    const networkRolesDeploymentPath = `./deployments/${network.name}/NetworkRoles.json`
    const networkRolesDeployment = fs.readFileSync(networkRolesDeploymentPath).toString()
    const networkRolesAddress = JSON.parse(networkRolesDeployment)["address"]

    const RSDDeploymentPath = `./deployments/${network.name}/RSD.json`
    const RSDDeployment = fs.readFileSync(RSDDeploymentPath).toString()
    const RSDAddress = JSON.parse(RSDDeployment)["address"]

    const creditPoolDeploymentPath = `./deployments/${network.name}/CreditPool.json`
    const creditPoolDeployment = fs.readFileSync(creditPoolDeploymentPath).toString()
    const creditPoolAddress = JSON.parse(creditPoolDeployment)["address"]

    if (!creditRequestAddress || !networkRolesAddress)
      throw new Error("contracts not deployed on this network")

    const member = await addr(ethers, taskArgs.member)
    const amount = ethers.utils.parseUnits(taskArgs.amount, "mwei")
    const signer = (await ethers.getSigners())[0]

    const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")
    const creditRequestFactory = await ethers.getContractFactory("CreditRequest")

    const creditRequest = new ethers.Contract(
      creditRequestAddress,
      creditRequestFactory.interface,
      signer
    )
    const networkRoles = new ethers.Contract(
      networkRolesAddress,
      networkRolesFactory.interface,
      signer
    )

    try {
      if (!(await networkRoles.isMember(member))) {
        await (await networkRoles.grantMember(member)).wait()
      }

      await (
        await creditRequest.createAndAcceptRequest(RSDAddress, member, amount, creditPoolAddress)
      ).wait()

      console.log("Credit Issued")
    } catch (e) {
      console.log(e)
    }
  })
