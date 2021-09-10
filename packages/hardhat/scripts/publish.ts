import { copySync } from "fs-extra"
const fs = require("fs")
const chalk = require("chalk")
const fse = require("fs-extra")

const graphDir = "./../subgraph"
const deploymentsDir = "./deployments"
const typesDir = "./types"
const publishDir = "./../react-app/src/contracts"

//TODO: store the deployed contracts into a single file with the contract address and blockNumber

function publishContract(contractName: string, networkName: string) {
  try {
    let contract = fs
      .readFileSync(`${deploymentsDir}/${networkName}/${contractName}.json`)
      .toString()
    contract = JSON.parse(contract)
    const graphConfigPath = `${graphDir}/config/config.json`
    let graphConfig
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfig = fs.readFileSync(graphConfigPath).toString()
      } else {
        graphConfig = "{}"
      }
    } catch (e) {
      console.log(e)
    }
    graphConfig = JSON.parse(graphConfig)
    graphConfig[`${contractName}Address`] = contract.address
    graphConfig[`${contractName}StartBlock`] = Number(contract.receipt.blockNumber)
    graphConfig["network"] = networkName
    let folderPath = graphConfigPath.replace("/config.json", "")
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2))

    const clientConfigPath = `${publishDir}/artifacts.json`
    let clientConfig
    try {
      if (fs.existsSync(clientConfigPath)) {
        clientConfig = fs.readFileSync(clientConfigPath).toString()
      } else {
        clientConfig = "{}"
      }
    } catch (e) {
      console.log(e)
    }
    clientConfig = JSON.parse(clientConfig)
    clientConfig[contractName] = contract.address
    folderPath = clientConfigPath.replace("/artifacts.json", "")
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    fs.writeFileSync(clientConfigPath, JSON.stringify(clientConfig, null, 2))

    if (!fs.existsSync(`${graphDir}/abis`)) fs.mkdirSync(`${graphDir}/abis`)
    if (!contract.abi) console.log(contract.contractName)
    fs.writeFileSync(`${graphDir}/abis/${contractName}.json`, JSON.stringify(contract.abi, null, 2))
    return true
  } catch (e) {
    console.log("Failed to publish " + chalk.red(contractName) + " to the subgraph.")
    console.log(e)
    return false
  }
}

async function main() {
  const directories = fs.readdirSync(deploymentsDir)

  directories.forEach(function(directory) {
    const files = fs.readdirSync(`${deploymentsDir}/${directory}`)
    files.forEach(function(file) {
      if (file.indexOf(".json") >= 0 && file.indexOf(".dbg") === -1) {
        const contractName = file.replace(".json", "")
        publishContract(contractName, directory)
      }
    })
  })
  fse.copySync(typesDir, publishDir)
  console.log("✅  Published contracts to the subgraph package.")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
