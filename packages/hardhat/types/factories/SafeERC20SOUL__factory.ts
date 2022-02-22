/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { SafeERC20SOUL, SafeERC20SOULInterface } from "../SafeERC20SOUL";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x801f3537",
        type: "bytes32",
      },
    ],
    name: "c_0x801f3537",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60e7610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063e3d0a6b6146038575b600080fd5b604e6004803603810190604a91906066565b6050565b005b50565b600081359050606081609d565b92915050565b60006020828403121560795760786098565b5b60006085848285016053565b91505092915050565b6000819050919050565b600080fd5b60a481608e565b811460ae57600080fd5b5056fea2646970667358221220d89331ed9e9eeffbef11a6e619bb142131ebd3207f624b16054bd58f700c8f0e64736f6c63430008070033";

export class SafeERC20SOUL__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SafeERC20SOUL> {
    return super.deploy(overrides || {}) as Promise<SafeERC20SOUL>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): SafeERC20SOUL {
    return super.attach(address) as SafeERC20SOUL;
  }
  connect(signer: Signer): SafeERC20SOUL__factory {
    return super.connect(signer) as SafeERC20SOUL__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeERC20SOULInterface {
    return new utils.Interface(_abi) as SafeERC20SOULInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeERC20SOUL {
    return new Contract(address, _abi, signerOrProvider) as SafeERC20SOUL;
  }
}
