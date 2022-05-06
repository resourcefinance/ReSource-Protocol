import { task } from "hardhat/config"

task("viewMock", "view mock tx")
  .addParam("txhash", "Address to send mock to ")
  .setAction(async (taskArgs, { ethers, network }) => {
    const signer = (await ethers.getSigners())[0]

    const txHash = taskArgs.txhash

    const transaction = await signer.provider?.getTransaction(txHash)

    if (!transaction) return

    const MockFactory = await ethers.getContractFactory("MockERC20")

    const parsedTx = MockFactory.interface.parseTransaction({
      data: transaction.data,
      value: transaction.value,
    })

    console.log(parsedTx.name)
    console.log(parsedTx.args)
  })
