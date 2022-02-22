/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PriceOracle, PriceOracleInterface } from "../PriceOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161023538038061023583398181016040528101906100329190610054565b80600081905550506100a7565b60008151905061004e81610090565b92915050565b60006020828403121561006a5761006961008b565b5b60006100788482850161003f565b91505092915050565b6000819050919050565b600080fd5b61009981610081565b81146100a457600080fd5b50565b61017f806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806391b7f5ed1461004657806398d5fdca14610062578063a035b1fe14610080575b600080fd5b610060600480360381019061005b91906100cc565b61009e565b005b61006a6100a8565b6040516100779190610108565b60405180910390f35b6100886100b1565b6040516100959190610108565b60405180910390f35b8060008190555050565b60008054905090565b60005481565b6000813590506100c681610132565b92915050565b6000602082840312156100e2576100e161012d565b5b60006100f0848285016100b7565b91505092915050565b61010281610123565b82525050565b600060208201905061011d60008301846100f9565b92915050565b6000819050919050565b600080fd5b61013b81610123565b811461014657600080fd5b5056fea2646970667358221220b06b2e1eb27e84fab19c51a526e6b48077082f5fb9bb7e3f4a2006739a21f86a64736f6c63430008070033";

export class PriceOracle__factory extends ContractFactory {
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
    _price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PriceOracle> {
    return super.deploy(_price, overrides || {}) as Promise<PriceOracle>;
  }
  getDeployTransaction(
    _price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_price, overrides || {});
  }
  attach(address: string): PriceOracle {
    return super.attach(address) as PriceOracle;
  }
  connect(signer: Signer): PriceOracle__factory {
    return super.connect(signer) as PriceOracle__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PriceOracleInterface {
    return new utils.Interface(_abi) as PriceOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PriceOracle {
    return new Contract(address, _abi, signerOrProvider) as PriceOracle;
  }
}
