import { task } from "hardhat/config"
import { MockERC20__factory } from "../types/factories/MockERC20__factory"

task("viewMock", "view mock tx")
  .addParam("txhash", "Address to send mock to ")
  .setAction(async (taskArgs, { ethers, network }) => {
    const signer = (await ethers.getSigners())[0]

    const txHash = taskArgs.txhash

    const transaction = await signer.provider?.getTransaction(txHash)

    if (!transaction) return

    const mockInterface = new ethers.utils.Interface(MockERC20__factory.abi)

    const parsedTx = mockInterface.parseTransaction({
      data: transaction.data,
      value: transaction.value,
    })

    // if (parsedTx.name != "transfer") throw new Error("invalid transaction")

    console.log(parsedTx.name)
    console.log(parsedTx.args)
  })
