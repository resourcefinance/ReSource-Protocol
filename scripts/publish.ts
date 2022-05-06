import { network } from "hardhat"

const fs = require("fs")
const chalk = require("chalk")
const fse = require("fs-extra")

const graphDir = "./"
const deploymentsDir = "./deployments"

function publishContract(contractName: string, networkName: string) {
  try {
    let contract = fs
      .readFileSync(`${deploymentsDir}/${networkName}/${contractName}.json`)
      .toString()
    contract = JSON.parse(contract)
    const graphConfigPath = `${graphDir}/config.json`
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
    if (graphConfig.includes(contract.address)) return
    graphConfig = JSON.parse(graphConfig)
    graphConfig[`${contractName}Address`] = contract.address
    graphConfig[`${contractName}StartBlock`] = Number(contract.receipt.blockNumber)
    graphConfig["network"] = networkName
    let folderPath = graphConfigPath.replace("/config.json", "")
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2))

    return true
  } catch (e) {
    console.log("Failed to publish " + chalk.red(contractName))
    console.log(e)
    return false
  }
}

async function main() {
  if (!fs.existsSync(`${deploymentsDir}/${network.name}`)) return
  const files = fs.readdirSync(`${deploymentsDir}/${network.name}`)
  files.forEach(function (file) {
    if (file.indexOf(".json") >= 0 && file.indexOf(".dbg") === -1) {
      const contractName = file.replace(".json", "")
      publishContract(contractName, network.name)
    }
  })
  console.log("✅  Published contracts to config.")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
