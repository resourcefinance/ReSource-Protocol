/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IUnderwriteManager,
  IUnderwriteManagerInterface,
} from "../IUnderwriteManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "calculateLTV",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "convertNetworkToCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_creditLimit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
    ],
    name: "createCreditLine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "depositAndStakeCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_creditLimit",
        type: "uint256",
      },
    ],
    name: "extendCreditLine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCollateralToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "getCreditLine",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "getCreditLine",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underwriter",
            type: "address",
          },
          {
            internalType: "address",
            name: "network",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "issueDate",
            type: "uint256",
          },
        ],
        internalType: "struct IUnderwriteManager.CreditLine",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinLTV",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "getNeededCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "isCreditLineExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "isValidLTV",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "renewCreditLine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
    ],
    name: "swapCreditLineUnderwriter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "unstakeCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IUnderwriteManager__factory {
  static readonly abi = _abi;
  static createInterface(): IUnderwriteManagerInterface {
    return new utils.Interface(_abi) as IUnderwriteManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUnderwriteManager {
    return new Contract(address, _abi, signerOrProvider) as IUnderwriteManager;
  }
}
