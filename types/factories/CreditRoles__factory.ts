/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CreditRoles, CreditRolesInterface } from "../CreditRoles";

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
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "underwriter",
        type: "address",
      },
    ],
    name: "UnderwriterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "underwriter",
        type: "address",
      },
    ],
    name: "UnderwriterRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
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
        internalType: "address",
        name: "_network",
        type: "address",
      },
    ],
    name: "grantNetwork",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "grantOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_requestOperator",
        type: "address",
      },
    ],
    name: "grantRequestOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
    ],
    name: "grantUnderwriter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        internalType: "address[]",
        name: "_operators",
        type: "address[]",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "isCreditOperator",
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
        name: "_network",
        type: "address",
      },
    ],
    name: "isNetwork",
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
    name: "isRequestOperator",
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
        name: "_underwriter",
        type: "address",
      },
    ],
    name: "isUnderwriter",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
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
    ],
    name: "revokeNetwork",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "revokeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_requestOperator",
        type: "address",
      },
    ],
    name: "revokeRequestOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_underwriter",
        type: "address",
      },
    ],
    name: "revokeUnderwriter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50613025806100206000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c80638c262b25116100de578063a3a4f68c11610097578063e348da1311610071578063e348da131461046a578063e504d9b014610486578063f2fde38b146104a2578063fad8b32a146104be57610173565b8063a3a4f68c14610402578063ca15c8731461041e578063d547741f1461044e57610173565b80638c262b251461032e5780638da5cb5b1461034a5780639010d07c1461036857806391d1485414610398578063a217fddf146103c8578063a224cee7146103e657610173565b806341ebc6861161013057806341ebc6861461025c5780634d610b581461028c578063666dbf49146102bc578063715018a6146102d85780637591080e146102e25780637ca3ec28146102fe57610173565b806301ffc9a714610178578063248a9ca3146101a85780632ccd3ce0146101d85780632f2ff15d1461020857806336568abe146102245780633ff55a8514610240575b600080fd5b610192600480360381019061018d9190611ff0565b6104da565b60405161019f9190612038565b60405180910390f35b6101c260048036038101906101bd9190612089565b610554565b6040516101cf91906120c5565b60405180910390f35b6101f260048036038101906101ed919061213e565b610574565b6040516101ff9190612038565b60405180910390f35b610222600480360381019061021d919061216b565b6105a7565b005b61023e6004803603810190610239919061216b565b6105d0565b005b61025a6004803603810190610255919061213e565b610653565b005b6102766004803603810190610271919061213e565b610756565b6040516102839190612038565b60405180910390f35b6102a660048036038101906102a1919061213e565b6107ba565b6040516102b39190612038565b60405180910390f35b6102d660048036038101906102d1919061213e565b61081e565b005b6102e0610921565b005b6102fc60048036038101906102f7919061213e565b6109a9565b005b6103186004803603810190610313919061213e565b610aab565b6040516103259190612038565b60405180910390f35b6103486004803603810190610343919061213e565b610b0f565b005b610352610c12565b60405161035f91906121ba565b60405180910390f35b610382600480360381019061037d919061220b565b610c3c565b60405161038f91906121ba565b60405180910390f35b6103b260048036038101906103ad919061216b565b610c6b565b6040516103bf9190612038565b60405180910390f35b6103d0610cd6565b6040516103dd91906120c5565b60405180910390f35b61040060048036038101906103fb91906123a4565b610cdd565b005b61041c6004803603810190610417919061213e565b61104c565b005b61043860048036038101906104339190612089565b611117565b60405161044591906123fc565b60405180910390f35b6104686004803603810190610463919061216b565b61113b565b005b610484600480360381019061047f919061213e565b611164565b005b6104a0600480360381019061049b919061213e565b6112bb565b005b6104bc60048036038101906104b7919061213e565b611386565b005b6104d860048036038101906104d3919061213e565b61147e565b005b60007f5a05180f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061054d575061054c8261156d565b5b9050919050565b600060656000838152602001908152602001600020600101549050919050565b60006105a07f4f50455241544f5200000000000000000000000000000000000000000000000083610c6b565b9050919050565b6105b082610554565b6105c1816105bc6115e7565b6115ef565b6105cb838361168c565b505050565b6105d86115e7565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610645576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161063c9061249a565b60405180910390fd5b61064f82826116c0565b5050565b7f4f50455241544f52000000000000000000000000000000000000000000000000610685816106806115e7565b6115ef565b6106af7f4e4554574f524b0000000000000000000000000000000000000000000000000083610c6b565b1580156106e95750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b610728576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071f90612506565b60405180910390fd5b6107527f4e4554574f524b00000000000000000000000000000000000000000000000000836105a7565b5050565b60006107827f554e44455257524954455200000000000000000000000000000000000000000083610c6b565b806107b357506107b27f4f50455241544f5200000000000000000000000000000000000000000000000083610c6b565b5b9050919050565b60006107e67f4e4554574f524b0000000000000000000000000000000000000000000000000083610c6b565b8061081757506108167f4f50455241544f5200000000000000000000000000000000000000000000000083610c6b565b5b9050919050565b7f4f50455241544f520000000000000000000000000000000000000000000000006108508161084b6115e7565b6115ef565b8161087b7f554e44455257524954455200000000000000000000000000000000000000000082610c6b565b156108bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108b290612598565b60405180910390fd5b6108e57f554e444552575249544552000000000000000000000000000000000000000000846105a7565b7f36cc851f20e1a89ddbcd833e5b6f771ccbaa64e42cf70cba4585b0a9a425bf148360405161091491906121ba565b60405180910390a1505050565b6109296115e7565b73ffffffffffffffffffffffffffffffffffffffff16610947610c12565b73ffffffffffffffffffffffffffffffffffffffff161461099d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161099490612604565b60405180910390fd5b6109a760006116f4565b565b7f4f50455241544f520000000000000000000000000000000000000000000000006109db816109d66115e7565b6115ef565b81610a067f554e44455257524954455200000000000000000000000000000000000000000082610c6b565b610a45576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3c90612696565b60405180910390fd5b610a6f7f554e4445525752495445520000000000000000000000000000000000000000008461113b565b7f3a424a0cde7648d6b111c668a9baee152936cc9eec8905521034750fa0034e6083604051610a9e91906121ba565b60405180910390a1505050565b6000610ad77f524551554553540000000000000000000000000000000000000000000000000083610c6b565b80610b085750610b077f4f50455241544f5200000000000000000000000000000000000000000000000083610c6b565b5b9050919050565b7f4f50455241544f52000000000000000000000000000000000000000000000000610b4181610b3c6115e7565b6115ef565b610b6b7f524551554553540000000000000000000000000000000000000000000000000083610c6b565b158015610ba55750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b610be4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bdb90612702565b60405180910390fd5b610c0e7f5245515545535400000000000000000000000000000000000000000000000000836105a7565b5050565b600060c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000610c6382609760008681526020019081526020016000206117ba90919063ffffffff16565b905092915050565b60006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000801b81565b600060019054906101000a900460ff16610d055760008054906101000a900460ff1615610d0e565b610d0d6117d4565b5b610d4d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d4490612794565b60405180910390fd5b60008060019054906101000a900460ff161590508015610d9d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610da56117e5565b610db26000801b33611836565b610ddc7f4f50455241544f5200000000000000000000000000000000000000000000000033611836565b610e067f554e44455257524954455200000000000000000000000000000000000000000033611836565b610e307f4e4554574f524b0000000000000000000000000000000000000000000000000033611836565b610e5a7f524551554553540000000000000000000000000000000000000000000000000033611836565b610ea47f554e4445525752495445520000000000000000000000000000000000000000007f4f50455241544f52000000000000000000000000000000000000000000000000611844565b610eee7f4e4554574f524b000000000000000000000000000000000000000000000000007f4f50455241544f52000000000000000000000000000000000000000000000000611844565b610f387f52455155455354000000000000000000000000000000000000000000000000007f4f50455241544f52000000000000000000000000000000000000000000000000611844565b60005b8251811015610fef57600073ffffffffffffffffffffffffffffffffffffffff16838281518110610f6f57610f6e6127b4565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff161415610f9857600080fd5b610fdc7f4f50455241544f52000000000000000000000000000000000000000000000000848381518110610fcf57610fce6127b4565b5b60200260200101516105a7565b8080610fe790612812565b915050610f3b565b507f36cc851f20e1a89ddbcd833e5b6f771ccbaa64e42cf70cba4585b0a9a425bf143360405161101f91906121ba565b60405180910390a180156110485760008060016101000a81548160ff0219169083151502179055505b5050565b7f4f50455241544f5200000000000000000000000000000000000000000000000061107e816110796115e7565b6115ef565b816110a97f4e4554574f524b0000000000000000000000000000000000000000000000000082610c6b565b6110e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110df906128cd565b60405180910390fd5b6111127f4e4554574f524b000000000000000000000000000000000000000000000000008461113b565b505050565b6000611134609760008481526020019081526020016000206118a0565b9050919050565b61114482610554565b611155816111506115e7565b6115ef565b61115f83836116c0565b505050565b8061118f7f4f50455241544f5200000000000000000000000000000000000000000000000082610c6b565b156111cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111c69061295f565b60405180910390fd5b81600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611240576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611237906129cb565b60405180910390fd5b61124d6000801b33610c6b565b61128c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161128390612a5d565b60405180910390fd5b6112b67f4f50455241544f52000000000000000000000000000000000000000000000000846105a7565b505050565b7f4f50455241544f520000000000000000000000000000000000000000000000006112ed816112e86115e7565b6115ef565b816113187f524551554553540000000000000000000000000000000000000000000000000082610c6b565b611357576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161134e90612aef565b60405180910390fd5b6113817f52455155455354000000000000000000000000000000000000000000000000008461113b565b505050565b61138e6115e7565b73ffffffffffffffffffffffffffffffffffffffff166113ac610c12565b73ffffffffffffffffffffffffffffffffffffffff1614611402576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113f990612604565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611472576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161146990612b81565b60405180910390fd5b61147b816116f4565b50565b61148b6000801b33610c6b565b6114ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114c190612a5d565b60405180910390fd5b6114d2610c12565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611540576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161153790612bed565b60405180910390fd5b61156a7f4f50455241544f520000000000000000000000000000000000000000000000008261113b565b50565b60007f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806115e057506115df826118b5565b5b9050919050565b600033905090565b6115f98282610c6b565b6116885761161e8173ffffffffffffffffffffffffffffffffffffffff16601461191f565b61162c8360001c602061191f565b60405160200161163d929190612d1f565b6040516020818303038152906040526040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161167f9190612d92565b60405180910390fd5b5050565b6116968282611b5b565b6116bb8160976000858152602001908152602001600020611c3c90919063ffffffff16565b505050565b6116ca8282611c6c565b6116ef8160976000858152602001908152602001600020611d4e90919063ffffffff16565b505050565b600060c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160c960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006117c98360000183611d7e565b60001c905092915050565b60006117df30611da9565b15905090565b600060019054906101000a900460ff16611834576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161182b90612e26565b60405180910390fd5b565b611840828261168c565b5050565b600061184f83610554565b90508160656000858152602001908152602001600020600101819055508181847fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff60405160405180910390a4505050565b60006118ae82600001611dcc565b9050919050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b6060600060028360026119329190612e46565b61193c9190612ea0565b67ffffffffffffffff81111561195557611954612261565b5b6040519080825280601f01601f1916602001820160405280156119875781602001600182028036833780820191505090505b5090507f3000000000000000000000000000000000000000000000000000000000000000816000815181106119bf576119be6127b4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611a2357611a226127b4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006001846002611a639190612e46565b611a6d9190612ea0565b90505b6001811115611b0d577f3031323334353637383961626364656600000000000000000000000000000000600f861660108110611aaf57611aae6127b4565b5b1a60f81b828281518110611ac657611ac56127b4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c945080611b0690612ef6565b9050611a70565b5060008414611b51576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b4890612f6c565b60405180910390fd5b8091505092915050565b611b658282610c6b565b611c385760016065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611bdd6115e7565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000611c64836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611ddd565b905092915050565b611c768282610c6b565b15611d4a5760006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611cef6115e7565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b6000611d76836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611e4d565b905092915050565b6000826000018281548110611d9657611d956127b4565b5b9060005260206000200154905092915050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600081600001805490509050919050565b6000611de98383611f61565b611e42578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050611e47565b600090505b92915050565b60008083600101600084815260200190815260200160002054905060008114611f55576000600182611e7f9190612f8c565b9050600060018660000180549050611e979190612f8c565b9050818114611f06576000866000018281548110611eb857611eb76127b4565b5b9060005260206000200154905080876000018481548110611edc57611edb6127b4565b5b90600052602060002001819055508387600101600083815260200190815260200160002081905550505b85600001805480611f1a57611f19612fc0565b5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050611f5b565b60009150505b92915050565b600080836001016000848152602001908152602001600020541415905092915050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611fcd81611f98565b8114611fd857600080fd5b50565b600081359050611fea81611fc4565b92915050565b60006020828403121561200657612005611f8e565b5b600061201484828501611fdb565b91505092915050565b60008115159050919050565b6120328161201d565b82525050565b600060208201905061204d6000830184612029565b92915050565b6000819050919050565b61206681612053565b811461207157600080fd5b50565b6000813590506120838161205d565b92915050565b60006020828403121561209f5761209e611f8e565b5b60006120ad84828501612074565b91505092915050565b6120bf81612053565b82525050565b60006020820190506120da60008301846120b6565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061210b826120e0565b9050919050565b61211b81612100565b811461212657600080fd5b50565b60008135905061213881612112565b92915050565b60006020828403121561215457612153611f8e565b5b600061216284828501612129565b91505092915050565b6000806040838503121561218257612181611f8e565b5b600061219085828601612074565b92505060206121a185828601612129565b9150509250929050565b6121b481612100565b82525050565b60006020820190506121cf60008301846121ab565b92915050565b6000819050919050565b6121e8816121d5565b81146121f357600080fd5b50565b600081359050612205816121df565b92915050565b6000806040838503121561222257612221611f8e565b5b600061223085828601612074565b9250506020612241858286016121f6565b9150509250929050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61229982612250565b810181811067ffffffffffffffff821117156122b8576122b7612261565b5b80604052505050565b60006122cb611f84565b90506122d78282612290565b919050565b600067ffffffffffffffff8211156122f7576122f6612261565b5b602082029050602081019050919050565b600080fd5b600061232061231b846122dc565b6122c1565b9050808382526020820190506020840283018581111561234357612342612308565b5b835b8181101561236c57806123588882612129565b845260208401935050602081019050612345565b5050509392505050565b600082601f83011261238b5761238a61224b565b5b813561239b84826020860161230d565b91505092915050565b6000602082840312156123ba576123b9611f8e565b5b600082013567ffffffffffffffff8111156123d8576123d7611f93565b5b6123e484828501612376565b91505092915050565b6123f6816121d5565b82525050565b600060208201905061241160008301846123ed565b92915050565b600082825260208201905092915050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b6000612484602f83612417565b915061248f82612428565b604082019050919050565b600060208201905081810360008301526124b381612477565b9050919050565b7f696e76616c6964206e6574776f726b0000000000000000000000000000000000600082015250565b60006124f0600f83612417565b91506124fb826124ba565b602082019050919050565b6000602082019050818103600083015261251f816124e3565b9050919050565b7f4e6574776f726b526f6c65733a20756e64657277726974657220616c7265616460008201527f7920657869737473000000000000000000000000000000000000000000000000602082015250565b6000612582602883612417565b915061258d82612526565b604082019050919050565b600060208201905081810360008301526125b181612575565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006125ee602083612417565b91506125f9826125b8565b602082019050919050565b6000602082019050818103600083015261261d816125e1565b9050919050565b7f4e6574776f726b526f6c65733a20756e64657277726974657220646f6573206e60008201527f6f74206578697374000000000000000000000000000000000000000000000000602082015250565b6000612680602883612417565b915061268b82612624565b604082019050919050565b600060208201905081810360008301526126af81612673565b9050919050565b7f696e76616c696420726571756573740000000000000000000000000000000000600082015250565b60006126ec600f83612417565b91506126f7826126b6565b602082019050919050565b6000602082019050818103600083015261271b816126df565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b600061277e602e83612417565b915061278982612722565b604082019050919050565b600060208201905081810360008301526127ad81612771565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061281d826121d5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156128505761284f6127e3565b5b600182019050919050565b7f4e6574776f726b526f6c65733a206e6574776f726b20646f6573206e6f74206560008201527f7869737400000000000000000000000000000000000000000000000000000000602082015250565b60006128b7602483612417565b91506128c28261285b565b604082019050919050565b600060208201905081810360008301526128e6816128aa565b9050919050565b7f437265646974526f6c65733a206f70657261746f7220616c726561647920657860008201527f6973747300000000000000000000000000000000000000000000000000000000602082015250565b6000612949602483612417565b9150612954826128ed565b604082019050919050565b600060208201905081810360008301526129788161293c565b9050919050565b7f696e76616c6964206f70657261746f7220616464726573730000000000000000600082015250565b60006129b5601883612417565b91506129c08261297f565b602082019050919050565b600060208201905081810360008301526129e4816129a8565b9050919050565b7f4e6574776f726b526f6c65733a204f6e6c792061646d696e2063616e2063616c60008201527f6c00000000000000000000000000000000000000000000000000000000000000602082015250565b6000612a47602183612417565b9150612a52826129eb565b604082019050919050565b60006020820190508181036000830152612a7681612a3a565b9050919050565b7f4e6574776f726b526f6c65733a2072657175657374206f70657261746f72206460008201527f6f6573206e6f7420657869737400000000000000000000000000000000000000602082015250565b6000612ad9602d83612417565b9150612ae482612a7d565b604082019050919050565b60006020820190508181036000830152612b0881612acc565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000612b6b602683612417565b9150612b7682612b0f565b604082019050919050565b60006020820190508181036000830152612b9a81612b5e565b9050919050565b7f63616e27742072656d6f7665206f776e6572206f70657261746f720000000000600082015250565b6000612bd7601b83612417565b9150612be282612ba1565b602082019050919050565b60006020820190508181036000830152612c0681612bca565b9050919050565b600081905092915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b6000612c4e601783612c0d565b9150612c5982612c18565b601782019050919050565b600081519050919050565b60005b83811015612c8d578082015181840152602081019050612c72565b83811115612c9c576000848401525b50505050565b6000612cad82612c64565b612cb78185612c0d565b9350612cc7818560208601612c6f565b80840191505092915050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b6000612d09601183612c0d565b9150612d1482612cd3565b601182019050919050565b6000612d2a82612c41565b9150612d368285612ca2565b9150612d4182612cfc565b9150612d4d8284612ca2565b91508190509392505050565b6000612d6482612c64565b612d6e8185612417565b9350612d7e818560208601612c6f565b612d8781612250565b840191505092915050565b60006020820190508181036000830152612dac8184612d59565b905092915050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000612e10602b83612417565b9150612e1b82612db4565b604082019050919050565b60006020820190508181036000830152612e3f81612e03565b9050919050565b6000612e51826121d5565b9150612e5c836121d5565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612e9557612e946127e3565b5b828202905092915050565b6000612eab826121d5565b9150612eb6836121d5565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612eeb57612eea6127e3565b5b828201905092915050565b6000612f01826121d5565b91506000821415612f1557612f146127e3565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b6000612f56602083612417565b9150612f6182612f20565b602082019050919050565b60006020820190508181036000830152612f8581612f49565b9050919050565b6000612f97826121d5565b9150612fa2836121d5565b925082821015612fb557612fb46127e3565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea264697066735822122071e463634fef4aac9f453293dc7d17a89548a229d6f35202a3deb52fb94d64c864736f6c63430008090033";

export class CreditRoles__factory extends ContractFactory {
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
  ): Promise<CreditRoles> {
    return super.deploy(overrides || {}) as Promise<CreditRoles>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CreditRoles {
    return super.attach(address) as CreditRoles;
  }
  connect(signer: Signer): CreditRoles__factory {
    return super.connect(signer) as CreditRoles__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CreditRolesInterface {
    return new utils.Interface(_abi) as CreditRolesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CreditRoles {
    return new Contract(address, _abi, signerOrProvider) as CreditRoles;
  }
}