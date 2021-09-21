import { ethers, upgrades, getNamedAccounts } from "hardhat"
import { expect } from "chai"
import chai from "chai"
import { solidity } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers"
import { MultiSigWallet__factory } from "../types"
import { IKeyMultiSig } from "../types/IKeyMultiSig"
import { IiKeyWalletDeployer__factory } from "../types/factories/IiKeyWalletDeployer__factory"
import { IKeyWalletDeployer } from "../types/IKeyWalletDeployer"
import { NetworkRegistry } from "../types/NetworkRegistry"
import { IKeyMultiSig__factory } from "../types/factories/IKeyMultiSig__factory"
chai.use(solidity)

describe("MultiSig Tests", function() {
  let deployer: SignerWithAddress
  let temp: SignerWithAddress
  let client: SignerWithAddress
  let coSigner: SignerWithAddress
  let guardian: SignerWithAddress
  let newClient: SignerWithAddress
  let walletDeployer: IKeyWalletDeployer
  let networkRegistry: NetworkRegistry
  let multiSigWallet: IKeyMultiSig

  before(async function() {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    temp = accounts[1]
    client = accounts[2]
    coSigner = accounts[3]
    guardian = accounts[4]
    newClient = accounts[5]
  })

  it("Successfully deploys a walletRegistry and a multiSig wallet contract with client and coSigner", async function() {
    const { relaySigner } = await getNamedAccounts()

    const walletDeployerFactory = await ethers.getContractFactory("iKeyWalletDeployer")
    const networkRegistryFactory = await ethers.getContractFactory("NetworkRegistry")
    walletDeployer = (await upgrades.deployProxy(walletDeployerFactory, [])) as IKeyWalletDeployer
    networkRegistry = (await upgrades.deployProxy(networkRegistryFactory, [
      [],
      [],
      walletDeployer.address,
    ])) as NetworkRegistry

    await (await walletDeployer.transferOwnership(networkRegistry.address)).wait()

    const deployTx = await (
      await networkRegistry.deployNewWallet([client.address], [], coSigner.address, 2)
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
    expect(owners).to.contain(coSigner.address)
  })

  it("Successfully adds a guradian wallet", async () => {
    // populate addGuardian transaction using client wallet
    const data = (
      await multiSigWallet.connect(client).populateTransaction.addGuardian(guardian.address)
    ).data!

    // get multiSig owner tx nonce
    const clientNonce = await multiSigWallet.nonces(client.address)

    // generate prepare submit transaction hash for signature by client
    const clientHashToSign = ethers.utils.arrayify(
      await multiSigWallet
        .connect(client)
        .prepareSubmitTransaction(multiSigWallet.address, 0, data, clientNonce),
    )

    // generate client signature
    const clientSig = ethers.utils.joinSignature(await client.signMessage(clientHashToSign))

    const submissionResult = await (
      await multiSigWallet.submitTransactionByRelay(
        multiSigWallet.address,
        0,
        data,
        clientSig,
        client.address,
      )
    ).wait()

    const transactionId = submissionResult.events?.find(
      (e: any) => e.eventSignature == "Submission(uint256)",
    )?.args?.transactionId

    expect(transactionId).to.equal(0)

    // get nonce of ownerB
    const coSignerNonce = await multiSigWallet.nonces(coSigner.address)

    // generate prepare confirm transaction hash for signature by coSigner
    const coSignerHashToSign = ethers.utils.arrayify(
      await multiSigWallet
        .connect(coSigner)
        .prepareConfirmTransaction(transactionId, coSignerNonce),
    )

    // generate coSigner signature
    const coSignerSig = ethers.utils.joinSignature(await coSigner.signMessage(coSignerHashToSign))

    // 3. confirmTransactionByRelay using ownerB wallet
    await expect(
      multiSigWallet.confirmTransactionByRelay(
        transactionId,
        coSignerSig,
        coSigner.address.toLowerCase(),
      ),
    ).to.emit(multiSigWallet, "Execution")

    const owners = await multiSigWallet.getOwners()
    expect(owners).to.contain(coSigner.address)
    expect(owners).to.contain(guardian.address)
    expect(owners).to.contain(client.address)
  })
  it("Successfully replace client with newClient", async () => {
    // populate replaceOwner transaction using client wallet
    const data = (
      await multiSigWallet
        .connect(guardian)
        .populateTransaction.replaceClient(client.address, newClient.address)
    ).data!

    // get multiSig owner tx nonce
    const guardianNonce = await multiSigWallet.nonces(guardian.address)

    // generate prepare submit transaction hash for signature by client
    const guardianHashToSign = ethers.utils.arrayify(
      await multiSigWallet
        .connect(guardian)
        .prepareSubmitTransaction(multiSigWallet.address, 0, data, guardianNonce),
    )

    // generate client signature
    const guardianSig = ethers.utils.joinSignature(await guardian.signMessage(guardianHashToSign))

    const submissionResult = await (
      await multiSigWallet.submitTransactionByRelay(
        multiSigWallet.address,
        0,
        data,
        guardianSig,
        guardian.address,
      )
    ).wait()

    const transactionId = submissionResult.events?.find(
      (e: any) => e.eventSignature == "Submission(uint256)",
    )?.args?.transactionId

    expect(transactionId).to.equal(1)

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
    await expect(
      multiSigWallet.confirmTransactionByRelay(transactionId, coSignerSig, coSigner.address),
    ).to.emit(multiSigWallet, "Execution")

    const owners = await multiSigWallet.getOwners()
    expect(owners).to.contain(newClient.address)
    expect(owners).to.contain(coSigner.address)
    expect(owners).to.contain(guardian.address)
  })
})
