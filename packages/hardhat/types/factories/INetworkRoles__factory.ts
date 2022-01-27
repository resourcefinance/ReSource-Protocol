/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { INetworkRoles, INetworkRolesInterface } from "../INetworkRoles";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_member",
        type: "address",
      },
    ],
    name: "getMemberAmbassador",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ambassador",
        type: "address",
      },
    ],
    name: "isAmbassador",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_member",
        type: "address",
      },
    ],
    name: "isMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isNetworkOperator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class INetworkRoles__factory {
  static readonly abi = _abi;
  static createInterface(): INetworkRolesInterface {
    return new utils.Interface(_abi) as INetworkRolesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): INetworkRoles {
    return new Contract(address, _abi, signerOrProvider) as INetworkRoles;
  }
}
