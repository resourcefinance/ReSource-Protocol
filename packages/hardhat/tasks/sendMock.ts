import { task } from "hardhat/config"
import { SEND_MOCK } from "./task-names"
import fs from "fs"
import { addr } from "../hardhat.config"

task(SEND_MOCK, "Send Mock")
  .addParam("to", "Address to send mock to ")
  .addParam("amount", "Amount of mock to send to to address")
  .setAction(async (taskArgs, { ethers, network }) => {
    const deploymentPath = `./deployments/${network.name}/MockERC20.json`
    const mockDeployment = fs.readFileSync(deploymentPath).toString()
    const mockAddress = JSON.parse(mockDeployment)["address"]

    if (!mockAddress) throw new Error("token not deployed on this network")

    const to = await addr(ethers, taskArgs.to)
    const amount = ethers.utils.parseEther(taskArgs.amount)
    const signer = (await ethers.getSigners())[0]

    const MockFactory = await ethers.getContractFactory("MockERC20")

    const tokenContract = new ethers.Contract(mockAddress, MockFactory.interface, signer)

    try {
      await (await tokenContract.transfer(to, amount)).wait()
      console.log("Funds transfered")
    } catch (e) {
      console.log(e)
    }
  })
