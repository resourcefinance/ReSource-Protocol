import { task } from "hardhat/config"
const fs = require("fs")

import { CREATE_CONFIG } from "./task-names"

const configFile = "./config.env"
const clientString = "REACT_APP_"

task(CREATE_CONFIG, "create config").setAction(async (taskArgs, { ethers, network }) => {
  if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, JSON.stringify({}, null, 2))

  const rUSDDeploymentPath = `./deployments/${network.name}/RUSD.json`
  const creditFeeManagerDeploymentPath = `./deployments/${network.name}/CreditFeeManager.json`
  const creditPoolDeploymentPath = `./deployments/${network.name}/CreditPool.json`
  const creditRequestDeploymentPath = `./deployments/${network.name}/CreditRequest.json`
  const sourceTokenDeploymentPath = `./deployments/${network.name}/SourceToken.json`
  const networkRolesDeploymentPath = `./deployments/${network.name}/NetworkRoles.json`

  const rUSDDeployment = JSON.parse(fs.readFileSync(rUSDDeploymentPath).toString()).address
  const creditFeeManagerDeployment = JSON.parse(
    fs.readFileSync(creditFeeManagerDeploymentPath).toString()
  ).address
  const creditPoolDeployment = JSON.parse(
    fs.readFileSync(creditPoolDeploymentPath).toString()
  ).address
  const creditRequestDeployment = JSON.parse(
    fs.readFileSync(creditRequestDeploymentPath).toString()
  ).address
  const sourceTokenDeployment = JSON.parse(
    fs.readFileSync(sourceTokenDeploymentPath).toString()
  ).address
  const networkRolesDeployment = JSON.parse(
    fs.readFileSync(networkRolesDeploymentPath).toString()
  ).address

  if (
    !rUSDDeployment ||
    !creditFeeManagerDeployment ||
    !creditPoolDeployment ||
    !creditRequestDeployment ||
    !sourceTokenDeployment ||
    !networkRolesDeployment
  )
    throw new Error("rUSD not deployed on this network")

  const addresses = {
    RUSD_ADDRESS: rUSDDeployment,
    CREDIT_POOL_ADDRESS: creditPoolDeployment,
    CREDIT_REQUEST_ADDRESS: creditRequestDeployment,
    SOURCE_ADDRESS: sourceTokenDeployment,
    CREDIT_FEE_MANAGER_ADDRESS: creditFeeManagerDeployment,
    NETWORK_ROLES_ADDRESS: networkRolesDeployment,
  }

  let envFile = ""

  for (const key of Object.keys(addresses)) {
    envFile += `${key}=${addresses[key]}\n`
  }

  envFile += `\n`

  for (const key of Object.keys(addresses)) {
    envFile += clientString + `${key}=${addresses[key]}\n`
  }

  fs.writeFileSync(configFile, envFile)

  console.log("Config created")
})
