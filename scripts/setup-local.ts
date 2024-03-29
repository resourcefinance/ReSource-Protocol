import { ethers, getNamedAccounts, network } from "hardhat"
import fs from "fs"
import { send } from "../hardhat.config"
import { RSD } from "../types/RSD"

async function main() {
  const operator = "networkOperator-" + network.name
  const networkOperator = (await getNamedAccounts())[operator]

  const creditDeploymentPath = `./deployments/${network.name}/CreditRoles.json`
  const creditRolesDeployment = fs.readFileSync(creditDeploymentPath).toString()
  const creditRolesAddress = JSON.parse(creditRolesDeployment)["address"]

  if (!creditRolesAddress) throw new Error("credit roles not deployed on this network")

  const networkDeploymentPath = `./deployments/${network.name}/NetworkRoles.json`
  const networkRolesDeployment = fs.readFileSync(networkDeploymentPath).toString()
  const networkRolesAddress = JSON.parse(networkRolesDeployment)["address"]

  if (!networkRolesAddress) throw new Error("network roles not deployed on this network")

  const signer = (await ethers.getSigners())[0]

  const creditRolesFactory = await ethers.getContractFactory("CreditRoles")

  const creditRoles = new ethers.Contract(creditRolesAddress, creditRolesFactory.interface, signer)

  const networkRolesFactory = await ethers.getContractFactory("NetworkRoles")

  const networkRoles = new ethers.Contract(
    networkRolesAddress,
    networkRolesFactory.interface,
    signer
  )

  try {
    if (!(await creditRoles.isRequestOperator(networkOperator)))
      await (await creditRoles.grantRequestOperator(networkOperator)).wait()
    if (!(await creditRoles.isUnderwriter(networkOperator)))
      await (await creditRoles.grantUnderwriter(networkOperator)).wait()
    if (!(await networkRoles.isNetworkOperator(networkOperator)))
      await (await networkRoles.grantOperator(networkOperator)).wait()

    let amount = ethers.utils.parseEther("1000")
    let address = networkOperator
    if (network.name === "localhost") {
      const tx = {
        to: address,
        value: amount,
      }
      await send(signer, tx)
    }

    const sourceFactory = await ethers.getContractFactory("SourceToken")
    const sourceDeploymentPath = `./deployments/${network.name}/SourceToken.json`
    const sourceTokenDeployment = fs.readFileSync(sourceDeploymentPath).toString()
    const sourceTokenAddress = JSON.parse(sourceTokenDeployment)["address"]
    const source = new ethers.Contract(sourceTokenAddress, sourceFactory.interface, signer)
    await (await source.transfer(address, amount)).wait()

    const RSDFactory = await ethers.getContractFactory("RSD")
    const RSDDeploymentPath = `./deployments/${network.name}/RSD.json`
    const RSDDeployment = JSON.parse(fs.readFileSync(RSDDeploymentPath).toString()).address
    const RSD = new ethers.Contract(RSDDeployment, RSDFactory.interface, signer) as RSD
    if (await RSD.paused()) await (await RSD.unpause()).wait()
  } catch (e) {
    console.log(e)
  }
  console.log("✅ environment provisioned.")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
