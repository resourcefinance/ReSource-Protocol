import { ethers, upgrades, getNamedAccounts, network } from "hardhat"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { tryWithGas } from "../utils/tryWithGas"
import {
  IKeyMultiSig,
  IKeyMultiSig__factory,
  IKeyWalletDeployer,
  NetworkRegistry,
  ReSourceToken,
  RUSD,
  UnderwriteManager,
} from "../types"

chai.use(solidity)

describe("iKeyMultiSig RUSD Tests", function() {
  let deployer: SignerWithAddress
  let client: SignerWithAddress
  let guardian: SignerWithAddress
  let coSigner: SignerWithAddress
  let targetWallet: SignerWithAddress
  let multiSigWallet: IKeyMultiSig
  let walletDeployer: IKeyWalletDeployer
  let networkRegistry: NetworkRegistry
  let rUSD: RUSD

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    client = accounts[2]
    guardian = accounts[3]
    coSigner = accounts[4]
    targetWallet = accounts[5]
  })

  it("Successfully deploys a walletRegistry and multiSig", async function() {
    const walletFactory = await ethers.getContractFactory("iKeyMultiSig")
    const { relaySigner } = await getNamedAccounts()

    const walletDeployerFactory = await ethers.getContractFactory("iKeyWalletDeployer")
    const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")
    walletDeployer = (await upgrades.deployProxy(walletDeployerFactory, [])) as IKeyWalletDeployer
    networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
      [targetWallet.address],
      [],
      walletDeployer.address,
    ])) as NetworkRegistry

    await (await walletDeployer.transferOwnership(networkRegistry.address)).wait()

    const deployTx = await (
      await networkRegistry.deployNewWallet(
        [client.address],
        [guardian.address],
        coSigner.address,
        2,
      )
    ).wait()

    const multiSigWalletAddress = deployTx.events?.find(
      (e: any) => e.eventSignature == "WalletDeployed(address)",
    )?.args?.newMember

    multiSigWallet = new ethers.Contract(
      multiSigWalletAddress,
      IKeyMultiSig__factory.createInterface(),
      deployer,
    ) as IKeyMultiSig

    expect(multiSigWallet.address).to.properAddress

    const owners = await multiSigWallet.getOwners()
    expect(owners).to.contain(client.address)
    expect(owners).to.contain(guardian.address)
    expect(owners).to.contain(coSigner.address)
  })

  it("Successfully deploys RUSD", async function() {
    const reSourceTokenFactory = await ethers.getContractFactory("ReSourceToken")

    const reSourceToken = (await upgrades.deployProxy(reSourceTokenFactory, [
      ethers.utils.parseEther("10000000"),
      [],
    ])) as ReSourceToken

    const underwriteManagerFactory = await ethers.getContractFactory("UnderwriteManager")

    const underwriteManager = (await upgrades.deployProxy(underwriteManagerFactory, [
      reSourceToken.address,
    ])) as UnderwriteManager

    const rUSDFactory = await ethers.getContractFactory("RUSD")

    rUSD = (await upgrades.deployProxy(
      rUSDFactory,
      [
        networkRegistry.address,
        20,
        underwriteManager.address,
        ethers.utils.getAddress(deployer.address),
      ],
      {
        initializer: "initializeRUSD",
      },
    )) as RUSD

    await (await underwriteManager.addNetwork(rUSD.address)).wait()

    await (
      await rUSD
        .connect(deployer)
        .setCreditLimit(multiSigWallet.address, ethers.utils.parseUnits("3000.0", "mwei"))
    ).wait()
  })

  it("Successfully send RUSD to targetWallet", async () => {
    // populate replaceOwner transaction using ownerA wallet
    const data = (
      await rUSD.populateTransaction.transfer(
        targetWallet.address,
        ethers.utils.parseUnits("300.0", "mwei"),
      )
    ).data!

    // get multiSig owner tx nonce
    const clientNonce = await multiSigWallet.nonces(client.address)

    // generate prepare submit transaction hash for signature by ownerA
    const clientHashToSign = ethers.utils.arrayify(
      await multiSigWallet
        .connect(client)
        .prepareSubmitTransaction(rUSD.address, 0, data, clientNonce),
    )

    // generate ownerA signature
    const clientSig = ethers.utils.joinSignature(await client.signMessage(clientHashToSign))
    const submissionResult = await (
      await multiSigWallet.submitTransactionByRelay(
        rUSD.address,
        0,
        data,
        clientSig,
        client.address,
      )
    ).wait()

    const transactionId = submissionResult.events?.find(
      (e: any) => e.eventSignature == "Submission(uint256)",
    )?.args?.transactionId

    expect(transactionId).to.equal("0")

    // get nonce of coSigner
    const coSignerNonce = await multiSigWallet.nonces(coSigner.address)

    // generate prepare confirm transaction hash for signature by coSigner
    const coSignerHashToSign = ethers.utils.arrayify(
      await multiSigWallet
        .connect(coSigner)
        .prepareConfirmTransaction(transactionId, coSignerNonce),
    )

    // generate coSigner signature
    const coSignerSig = ethers.utils.joinSignature(await coSigner.signMessage(coSignerHashToSign))
    // 3. confirmTransactionByRelay using coSigner wallet

    const func = multiSigWallet.confirmTransactionByRelay
    const gas = await multiSigWallet.estimateGas.confirmTransactionByRelay(
      transactionId,
      coSignerSig,
      coSigner.address,
    )
    const args = [transactionId, coSignerSig, coSigner.address]

    const result = await tryWithGas(func, args, gas)

    const targetWalletBalance = await rUSD.balanceOf(targetWallet.address)

    expect(ethers.utils.formatUnits(targetWalletBalance, "mwei")).to.equal("300.0")
  })
})
