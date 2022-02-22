/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CreditRequest, CreditRequestInterface } from "../CreditRequest";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
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
        name: "_pool",
        type: "address",
      },
    ],
    name: "acceptRequest",
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
    ],
    name: "approveRequest",
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
        name: "_creditLimit",
        type: "uint256",
      },
    ],
    name: "createRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creditManager",
    outputs: [
      {
        internalType: "contract ICreditManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creditRoles",
    outputs: [
      {
        internalType: "contract ICreditRoles",
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
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_counterparty",
        type: "address",
      },
    ],
    name: "deleteRequest",
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
    ],
    name: "getCreditRequest",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "unstaking",
            type: "bool",
          },
          {
            internalType: "address",
            name: "ambassador",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creditLimit",
            type: "uint256",
          },
        ],
        internalType: "struct ICreditRequest.CreditRequest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creditRoles",
        type: "address",
      },
      {
        internalType: "address",
        name: "_creditManager",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "paused",
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
    inputs: [],
    name: "renounceOwnership",
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
    ],
    name: "requestUnstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "unstaking",
        type: "bool",
      },
      {
        internalType: "address",
        name: "ambassador",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "creditLimit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
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
        name: "_creditLimit",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "updateRequestLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506135cd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80638da5cb5b11610097578063db3f00fe11610066578063db3f00fe14610236578063e29c4c2914610254578063e696220914610287578063f2fde38b146102a3576100f5565b80638da5cb5b146101ae5780639b04b405146101cc578063b0addede146101fc578063c12c21c014610218576100f5565b80635c975abb116100d35780635c975abb1461014e578063672c7c9b1461016c578063715018a614610188578063763fd61c14610192576100f5565b80633148f390146100fa578063485cc955146101165780634af98ba114610132575b600080fd5b610114600480360381019061010f9190612704565b6102bf565b005b610130600480360381019061012b9190612704565b610514565b005b61014c60048036038101906101479190612704565b610681565b005b61015661091c565b6040516101639190612cc2565b60405180910390f35b610186600480360381019061018191906127ea565b610933565b005b610190610c60565b005b6101ac60048036038101906101a79190612704565b610ce8565b005b6101b6611030565b6040516101c39190612bcb565b60405180910390f35b6101e660048036038101906101e19190612704565b61105a565b6040516101f39190612f78565b60405180910390f35b61021660048036038101906102119190612797565b611187565b005b610220611786565b60405161022d9190612d22565b60405180910390f35b61023e6117ac565b60405161024b9190612d3d565b60405180910390f35b61026e60048036038101906102699190612704565b6117d2565b60405161027e9493929190612cdd565b60405180910390f35b6102a1600480360381019061029c9190612744565b611849565b005b6102bd60048036038101906102b891906126aa565b611f9c565b005b609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637ca3ec28336040518263ffffffff1660e01b815260040161031a9190612bcb565b602060405180830381600087803b15801561033457600080fd5b505af1158015610348573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061036c9190612851565b6103ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103a290612e38565b60405180910390fd5b609960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff1615610478576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046f90612eb8565b60405180910390fd5b6001609960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548160ff0219169083151502179055505050565b600060019054906101000a900460ff168061053a575060008054906101000a900460ff16155b610579576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057090612dd8565b60405180910390fd5b60008060019054906101000a900460ff1615905080156105c9576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b82609760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081609860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610653612094565b61065b61217d565b801561067c5760008060016101000a81548160ff0219169083151502179055505b505050565b3373ffffffffffffffffffffffffffffffffffffffff16609960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614806108035750609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637ca3ec28336040518263ffffffff1660e01b81526004016107b09190612bcb565b602060405180830381600087803b1580156107ca57600080fd5b505af11580156107de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108029190612851565b5b610842576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083990612e98565b60405180910390fd5b609960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549060ff02191690556000820160016101000a81549060ff02191690556000820160026101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600182016000905550505050565b6000606560009054906101000a900460ff16905090565b6000609960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010154116109f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109ec90612f38565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16609960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161480610b755750609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632ccd3ce0336040518263ffffffff1660e01b8152600401610b249190612bcb565b60206040518083038186803b158015610b3c57600080fd5b505afa158015610b50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b749190612851565b5b610bb4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bab90612d58565b60405180910390fd5b6000609960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050828160010181905550818160000160006101000a81548160ff0219169083151502179055505050505050565b610c68612266565b73ffffffffffffffffffffffffffffffffffffffff16610c86611030565b73ffffffffffffffffffffffffffffffffffffffff1614610cdc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cd390612e18565b60405180910390fd5b610ce6600061226e565b565b6000609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1f094a884846040518363ffffffff1660e01b8152600401610d47929190612be6565b602060405180830381600087803b158015610d6157600080fd5b505af1158015610d75573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d9991906126d7565b90508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e09576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e0090612d98565b60405180910390fd5b6000609960008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060000160019054906101000a900460ff1615610edb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ed290612df8565b60405180910390fd5b6040518060800160405280600115158152602001600115158152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000815250609960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548160ff02191690831515021790555060208201518160000160016101000a81548160ff02191690831515021790555060408201518160000160026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816001015590505050505050565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6110626125ea565b609960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060800160405290816000820160009054906101000a900460ff161515151581526020016000820160019054906101000a900460ff161515151581526020016000820160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600182015481525050905092915050565b60008373ffffffffffffffffffffffffffffffffffffffff16631b4a9d216040518163ffffffff1660e01b815260040160206040518083038186803b1580156111cf57600080fd5b505afa1580156111e3573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061120791906126d7565b905060008173ffffffffffffffffffffffffffffffffffffffff166358b7cc83856040518263ffffffff1660e01b81526004016112449190612bcb565b60206040518083038186803b15801561125c57600080fd5b505afa158015611270573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129491906126d7565b905060008473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806112fd57508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b806113b15750609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637ca3ec28336040518263ffffffff1660e01b815260040161135e9190612bcb565b602060405180830381600087803b15801561137857600080fd5b505af115801561138c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113b09190612851565b5b9050806113f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113ea90612ed8565b60405180910390fd5b6000609960008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010154146114b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114ac90612db8565b60405180910390fd5b60008673ffffffffffffffffffffffffffffffffffffffff166332a92229876040518263ffffffff1660e01b81526004016114f09190612bcb565b60206040518083038186803b15801561150857600080fd5b505afa15801561151c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611540919061287e565b905084811115611585576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157c90612e78565b60405180910390fd5b6040518060800160405280609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637ca3ec28336040518263ffffffff1660e01b81526004016115eb9190612bcb565b602060405180830381600087803b15801561160557600080fd5b505af1158015611619573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061163d9190612851565b151581526020016000151581526020013373ffffffffffffffffffffffffffffffffffffffff16815260200186815250609960008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548160ff02191690831515021790555060208201518160000160016101000a81548160ff02191690831515021790555060408201518160000160026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816001015590505050505050505050565b609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6099602052816000526040600020602052806000526040600020600091509150508060000160009054906101000a900460ff16908060000160019054906101000a900460ff16908060000160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154905084565b609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166341ebc686336040518263ffffffff1660e01b81526004016118a49190612bcb565b60206040518083038186803b1580156118bc57600080fd5b505afa1580156118d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118f49190612851565b611933576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161192a90612e58565b60405180910390fd5b609960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff166119ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119f690612f18565b60405180910390fd5b6000609960008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060008473ffffffffffffffffffffffffffffffffffffffff16634a9a75aa856040518263ffffffff1660e01b8152600401611aba9190612bcb565b60206040518083038186803b158015611ad257600080fd5b505afa158015611ae6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b0a919061287e565b90506000609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1f094a887876040518363ffffffff1660e01b8152600401611b6b929190612be6565b602060405180830381600087803b158015611b8557600080fd5b505af1158015611b99573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bbd91906126d7565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611c9057609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166383e9a9e0868686600101548a6040518563ffffffff1660e01b8152600401611c599493929190612c7d565b600060405180830381600087803b158015611c7357600080fd5b505af1158015611c87573d6000803e3d6000fd5b50505050611ebe565b8260000160019054906101000a900460ff1615611dac578073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415611d16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d0d90612ef8565b60405180910390fd5b609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636c028dc78787876040518463ffffffff1660e01b8152600401611d7593929190612c0f565b600060405180830381600087803b158015611d8f57600080fd5b505af1158015611da3573d6000803e3d6000fd5b50505050611ebd565b8183600101541115611ebc578073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611e26576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e1d90612f58565b60405180910390fd5b609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166326c27d45878786600101546040518463ffffffff1660e01b8152600401611e8993929190612c46565b600060405180830381600087803b158015611ea357600080fd5b505af1158015611eb7573d6000803e3d6000fd5b505050505b5b5b609960008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549060ff02191690556000820160016101000a81549060ff02191690556000820160026101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090555050505050505050565b611fa4612266565b73ffffffffffffffffffffffffffffffffffffffff16611fc2611030565b73ffffffffffffffffffffffffffffffffffffffff1614612018576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161200f90612e18565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415612088576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161207f90612d78565b60405180910390fd5b6120918161226e565b50565b600060019054906101000a900460ff16806120ba575060008054906101000a900460ff16155b6120f9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120f090612dd8565b60405180910390fd5b60008060019054906101000a900460ff161590508015612149576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b612151612334565b61215961240d565b801561217a5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806121a3575060008054906101000a900460ff16155b6121e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016121d990612dd8565b60405180910390fd5b60008060019054906101000a900460ff161590508015612232576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61223a612334565b612242612501565b80156122635760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600060019054906101000a900460ff168061235a575060008054906101000a900460ff16155b612399576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161239090612dd8565b60405180910390fd5b60008060019054906101000a900460ff1615905080156123e9576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561240a5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680612433575060008054906101000a900460ff16155b612472576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161246990612dd8565b60405180910390fd5b60008060019054906101000a900460ff1615905080156124c2576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6000606560006101000a81548160ff02191690831515021790555080156124fe5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680612527575060008054906101000a900460ff16155b612566576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161255d90612dd8565b60405180910390fd5b60008060019054906101000a900460ff1615905080156125b6576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6125c66125c1612266565b61226e565b80156125e75760008060016101000a81548160ff0219169083151502179055505b50565b6040518060800160405280600015158152602001600015158152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081525090565b60008135905061263b81613552565b92915050565b60008151905061265081613552565b92915050565b60008135905061266581613569565b92915050565b60008151905061267a81613569565b92915050565b60008135905061268f81613580565b92915050565b6000815190506126a481613580565b92915050565b6000602082840312156126c0576126bf613034565b5b60006126ce8482850161262c565b91505092915050565b6000602082840312156126ed576126ec613034565b5b60006126fb84828501612641565b91505092915050565b6000806040838503121561271b5761271a613034565b5b60006127298582860161262c565b925050602061273a8582860161262c565b9150509250929050565b60008060006060848603121561275d5761275c613034565b5b600061276b8682870161262c565b935050602061277c8682870161262c565b925050604061278d8682870161262c565b9150509250925092565b6000806000606084860312156127b0576127af613034565b5b60006127be8682870161262c565b93505060206127cf8682870161262c565b92505060406127e086828701612680565b9150509250925092565b6000806000806080858703121561280457612803613034565b5b60006128128782880161262c565b94505060206128238782880161262c565b935050604061283487828801612680565b925050606061284587828801612656565b91505092959194509250565b60006020828403121561286757612866613034565b5b60006128758482850161266b565b91505092915050565b60006020828403121561289457612893613034565b5b60006128a284828501612695565b91505092915050565b6128b481612fa4565b82525050565b6128c381612fa4565b82525050565b6128d281612fb6565b82525050565b6128e181612fb6565b82525050565b6128f081612fec565b82525050565b6128ff81612ffe565b82525050565b6000612912603283612f93565b915061291d82613039565b604082019050919050565b6000612935602683612f93565b915061294082613088565b604082019050919050565b6000612958603883612f93565b9150612963826130d7565b604082019050919050565b600061297b602583612f93565b915061298682613126565b604082019050919050565b600061299e602e83612f93565b91506129a982613175565b604082019050919050565b60006129c1601e83612f93565b91506129cc826131c4565b602082019050919050565b60006129e4602083612f93565b91506129ef826131ed565b602082019050919050565b6000612a07603083612f93565b9150612a1282613216565b604082019050919050565b6000612a2a602c83612f93565b9150612a3582613265565b604082019050919050565b6000612a4d603f83612f93565b9150612a58826132b4565b604082019050919050565b6000612a70603283612f93565b9150612a7b82613303565b604082019050919050565b6000612a93602783612f93565b9150612a9e82613352565b604082019050919050565b6000612ab6604f83612f93565b9150612ac1826133a1565b606082019050919050565b6000612ad9602183612f93565b9150612ae482613416565b604082019050919050565b6000612afc602683612f93565b9150612b0782613465565b604082019050919050565b6000612b1f602583612f93565b9150612b2a826134b4565b604082019050919050565b6000612b42602283612f93565b9150612b4d82613503565b604082019050919050565b608082016000820151612b6e60008501826128c9565b506020820151612b8160208501826128c9565b506040820151612b9460408501826128ab565b506060820151612ba76060850182612bad565b50505050565b612bb681612fe2565b82525050565b612bc581612fe2565b82525050565b6000602082019050612be060008301846128ba565b92915050565b6000604082019050612bfb60008301856128ba565b612c0860208301846128ba565b9392505050565b6000606082019050612c2460008301866128ba565b612c3160208301856128ba565b612c3e60408301846128ba565b949350505050565b6000606082019050612c5b60008301866128ba565b612c6860208301856128ba565b612c756040830184612bbc565b949350505050565b6000608082019050612c9260008301876128ba565b612c9f60208301866128ba565b612cac6040830185612bbc565b612cb960608301846128ba565b95945050505050565b6000602082019050612cd760008301846128d8565b92915050565b6000608082019050612cf260008301876128d8565b612cff60208301866128d8565b612d0c60408301856128ba565b612d196060830184612bbc565b95945050505050565b6000602082019050612d3760008301846128e7565b92915050565b6000602082019050612d5260008301846128f6565b92915050565b60006020820190508181036000830152612d7181612905565b9050919050565b60006020820190508181036000830152612d9181612928565b9050919050565b60006020820190508181036000830152612db18161294b565b9050919050565b60006020820190508181036000830152612dd18161296e565b9050919050565b60006020820190508181036000830152612df181612991565b9050919050565b60006020820190508181036000830152612e11816129b4565b9050919050565b60006020820190508181036000830152612e31816129d7565b9050919050565b60006020820190508181036000830152612e51816129fa565b9050919050565b60006020820190508181036000830152612e7181612a1d565b9050919050565b60006020820190508181036000830152612e9181612a40565b9050919050565b60006020820190508181036000830152612eb181612a63565b9050919050565b60006020820190508181036000830152612ed181612a86565b9050919050565b60006020820190508181036000830152612ef181612aa9565b9050919050565b60006020820190508181036000830152612f1181612acc565b9050919050565b60006020820190508181036000830152612f3181612aef565b9050919050565b60006020820190508181036000830152612f5181612b12565b9050919050565b60006020820190508181036000830152612f7181612b35565b9050919050565b6000608082019050612f8d6000830184612b58565b92915050565b600082825260208201905092915050565b6000612faf82612fc2565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000612ff782613010565b9050919050565b600061300982613010565b9050919050565b600061301b82613022565b9050919050565b600061302d82612fc2565b9050919050565b600080fd5b7f437265646974526571756573743a20556e617574686f72697a656420746f207560008201527f7064617465207468697320726571756573740000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a2053656e646572206d75737420626520636f60008201527f756e7465727061727479277320756e6465727772697465720000000000000000602082015250565b7f437265646974526571756573743a205265717565737420616c7265616479206560008201527f7869737473000000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f556e7374616b65205265717565737420616c7265616479206578697374730000600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f437265646974526571756573743a2043616c6c6572206d75737420626520612060008201527f72657175657374206f70657261746f7200000000000000000000000000000000602082015250565b7f437265646974526571756573743a2043616c6c6572206d75737420626520616e60008201527f20756e6465727772697465720000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a2070726f766964656420637265646974206c60008201527f696d6974206973206c657373207468616e2063757272656e74206c696d697400602082015250565b7f437265646974526571756573743a20556e617574686f72697a656420746f206460008201527f656c657465207468697320726571756573740000000000000000000000000000602082015250565b7f437265646974526571756573743a207265717565737420616c7265616479206160008201527f7070726f76656400000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a2043616c6c6572206d75737420626520746860008201527f6520636f756e7465727061727479277320616d6261737361646f72206f72207460208201527f686520636f756e74657270617274790000000000000000000000000000000000604082015250565b7f43616e6e6f7420616363657074206f776e20756e7374616b652072657175657360008201527f7400000000000000000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a2072657175657374206973206e6f7420617060008201527f70726f7665640000000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a207265717565737420646f6573206e6f742060008201527f6578697374000000000000000000000000000000000000000000000000000000602082015250565b7f556e617574686f72697a656420746f20657874656e6420637265646974206c6960008201527f6e65000000000000000000000000000000000000000000000000000000000000602082015250565b61355b81612fa4565b811461356657600080fd5b50565b61357281612fb6565b811461357d57600080fd5b50565b61358981612fe2565b811461359457600080fd5b5056fea26469706673582212204e59561b9d9fb52daca0456d484cc662a314faba66d11e9c788311f2ea3b1e4164736f6c63430008070033";

export class CreditRequest__factory extends ContractFactory {
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
  ): Promise<CreditRequest> {
    return super.deploy(overrides || {}) as Promise<CreditRequest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CreditRequest {
    return super.attach(address) as CreditRequest;
  }
  connect(signer: Signer): CreditRequest__factory {
    return super.connect(signer) as CreditRequest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CreditRequestInterface {
    return new utils.Interface(_abi) as CreditRequestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CreditRequest {
    return new Contract(address, _abi, signerOrProvider) as CreditRequest;
  }
}
