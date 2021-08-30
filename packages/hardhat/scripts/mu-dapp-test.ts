// then go back to http://localhost:8000/subgraphs/name/mu-dapp/graphql and query for all creditLines boiiiii
import { ethers, getNamedAccounts } from "hardhat"
import { UnderwriteManager } from "../types/UnderwriteManager"
import { UnderwriteManager__factory } from "../../react-app/src/contracts/factories/UnderwriteManager__factory"
import { MutualityToken__factory } from "../../react-app/src/contracts/factories/MutualityToken__factory"
import { MutualityToken } from "../../react-app/src/contracts/MutualityToken"
import { parseEther } from "ethers/lib/utils"
const fs = require("fs")

const underwriteAbi = "./deployments/localhost/UnderwriteManager_Proxy.json"
const mutualityAbi = "./deployments/localhost/MutualityToken_Proxy.json"
const rUSDAbi = "./deployments/localhost/RUSD_Proxy.json"

async function issueCreditLine() {
  try {
    let underwriteContract = fs.readFileSync(underwriteAbi).toString()
    underwriteContract = JSON.parse(underwriteContract)
    const underwriteAddress = underwriteContract.address

    let mutualityContract = fs.readFileSync(mutualityAbi).toString()
    mutualityContract = JSON.parse(mutualityContract)
    const mutualityAddress = mutualityContract.address

    let rUSDContract = fs.readFileSync(rUSDAbi).toString()
    rUSDContract = JSON.parse(rUSDContract)
    const rUSDAddress = rUSDContract.address

    const deployer = (await ethers.getSigners())[0]
    const operator = (await ethers.getSigners())[1]
    const members = (await ethers.getSigners()).slice(2, 6)

    const underwriteManager = UnderwriteManager__factory.getContract(
      underwriteAddress,
      UnderwriteManager__factory.createInterface(),
      deployer,
    ) as UnderwriteManager

    const mutualityToken = MutualityToken__factory.getContract(
      mutualityAddress,
      MutualityToken__factory.createInterface(),
      deployer,
    ) as MutualityToken

    if (
      Number(
        ethers.utils.formatEther(
          await mutualityToken.allowance(operator.address, underwriteManager.address),
        ),
      ) == 0
    ) {
      await (
        await mutualityToken
          .connect(operator)
          .approve(
            underwriteManager.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          )
      ).wait()
    }

    if (Number(ethers.utils.formatEther(await mutualityToken.balanceOf(operator.address))) == 0) {
      await (
        await mutualityToken.transfer(operator.address, ethers.utils.parseEther("100000.0"))
      ).wait()
    }
    if (Number(ethers.utils.formatEther(await mutualityToken.balanceOf(operator.address))) > 0) {
      for (var member of members) {
        console.log(`Issuing $600 credit line to ${member.address}`)
        await (
          await underwriteManager
            .connect(operator)
            .underwrite(rUSDAddress, ethers.utils.parseEther("600.0"), member.address)
        ).wait()
      }
    }
  } catch (e) {
    console.log(e)
  }
}

async function main() {
  await issueCreditLine()
  console.log("✅  Issued a new line of credit.")
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
