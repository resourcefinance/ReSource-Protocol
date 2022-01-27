/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NetworkRoles, NetworkRolesInterface } from "../NetworkRoles";

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
        internalType: "address",
        name: "_ambassador",
        type: "address",
      },
    ],
    name: "acceptAmbassadorInvitation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_clients",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_guardians",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_coSigner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_required",
        type: "uint256",
      },
    ],
    name: "deployMemberWallet",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "_ambassador",
        type: "address",
      },
    ],
    name: "grantAmbassador",
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
      {
        internalType: "address",
        name: "_walletDeployer",
        type: "address",
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
        name: "_member",
        type: "address",
      },
    ],
    name: "inviteMember",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "removeOperator",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_ambassador",
        type: "address",
      },
    ],
    name: "revokeAmbassador",
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
  "0x608060405234801561001057600080fd5b506132b3806100206000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c806391d14854116100b8578063ac2db9d21161007c578063ac2db9d214610371578063ac8a584a1461038d578063d547741f146103a9578063e348da13146103c5578063e4807adf146103e1578063f2fde38b1461041157610142565b806391d14854146102a7578063995e5be4146102d75780639ac0c6ac146102f3578063a217fddf14610323578063a230c5241461034157610142565b806336568abe1161010a57806336568abe146101fb578063420fc5d814610217578063462d0b2e146102335780635db9fc8a1461024f578063715018a61461027f5780638da5cb5b1461028957610142565b806301ffc9a714610147578063248a9ca31461017757806329760161146101a75780632f2ff15d146101c35780632f890b93146101df575b600080fd5b610161600480360381019061015c91906123d3565b61042d565b60405161016e9190612826565b60405180910390f35b610191600480360381019061018c9190612366565b6104a7565b60405161019e9190612841565b60405180910390f35b6101c160048036038101906101bc91906122c7565b6104c7565b005b6101dd60048036038101906101d89190612393565b610739565b005b6101f960048036038101906101f49190612211565b610762565b005b61021560048036038101906102109190612393565b61095e565b005b610231600480360381019061022c9190612211565b6109e1565b005b61024d6004803603810190610248919061226b565b610be1565b005b61026960048036038101906102649190612211565b610edc565b60405161027691906127b8565b60405180910390f35b610287610f45565b005b610291610fcd565b60405161029e91906127b8565b60405180910390f35b6102c160048036038101906102bc9190612393565b610ff7565b6040516102ce9190612826565b60405180910390f35b6102f160048036038101906102ec9190612211565b611062565b005b61030d60048036038101906103089190612211565b6111d6565b60405161031a9190612826565b60405180910390f35b61032b611209565b6040516103389190612841565b60405180910390f35b61035b60048036038101906103569190612211565b611210565b6040516103689190612826565b60405180910390f35b61038b60048036038101906103869190612211565b611243565b005b6103a760048036038101906103a29190612211565b6113b6565b005b6103c360048036038101906103be9190612393565b6114a5565b005b6103df60048036038101906103da9190612211565b6114ce565b005b6103fb60048036038101906103f69190612211565b611625565b6040516104089190612826565b60405180910390f35b61042b60048036038101906104269190612211565b611658565b005b60007f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104a0575061049f82611750565b5b9050919050565b600060656000838152602001908152602001600020600101549050919050565b6104f17f414d4241535341444f520000000000000000000000000000000000000000000033610ff7565b8061052257506105217f4f50455241544f5200000000000000000000000000000000000000000000000033610ff7565b5b610561576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105589061295e565b60405180910390fd5b600060ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9b01c29868686866040518563ffffffff1660e01b81526004016105c494939291906127d3565b602060405180830381600087803b1580156105de57600080fd5b505af11580156105f2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610616919061223e565b90508073ffffffffffffffffffffffffffffffffffffffff1663f2fde38b61063c610fcd565b6040518263ffffffff1660e01b815260040161065891906127b8565b600060405180830381600087803b15801561067257600080fd5b505af1158015610686573d6000803e3d6000fd5b505050503360cb60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506107327f4d454d424552000000000000000000000000000000000000000000000000000082610739565b5050505050565b610742826104a7565b6107538161074e6117ba565b6117c2565b61075d838361185f565b505050565b61078c7f414d4241535341444f520000000000000000000000000000000000000000000033610ff7565b806107bd57506107bc7f4f50455241544f5200000000000000000000000000000000000000000000000033610ff7565b5b6107fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107f39061295e565b60405180910390fd5b60cc60008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156108c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108bd9061297e565b60405180910390fd5b600160cc60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b6109666117ba565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146109d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109ca90612a3e565b60405180910390fd5b6109dd8282611940565b5050565b60cc60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610aaa576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa1906128de565b60405180910390fd5b8060cb60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060cc60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff0219169055610bde7f4d454d424552000000000000000000000000000000000000000000000000000033610739565b50565b600060019054906101000a900460ff1680610c07575060008054906101000a900460ff16155b610c46576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3d9061299e565b60405180910390fd5b60008060019054906101000a900460ff161590508015610c96576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610c9e611a22565b8160ca60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d097f4f50455241544f5200000000000000000000000000000000000000000000000033611b13565b610d337f414d4241535341444f520000000000000000000000000000000000000000000033611b13565b610d5d7f4d454d424552000000000000000000000000000000000000000000000000000033611b13565b610da77f414d4241535341444f52000000000000000000000000000000000000000000007f4f50455241544f52000000000000000000000000000000000000000000000000611b21565b610df17f4d454d42455200000000000000000000000000000000000000000000000000007f414d4241535341444f5200000000000000000000000000000000000000000000611b21565b60005b8351811015610ea857600073ffffffffffffffffffffffffffffffffffffffff16848281518110610e2857610e27612d43565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff161415610e5157600080fd5b610e957f4f50455241544f52000000000000000000000000000000000000000000000000858381518110610e8857610e87612d43565b5b6020026020010151610739565b8080610ea090612ccb565b915050610df4565b50610eb66000801b33610739565b8015610ed75760008060016101000a81548160ff0219169083151502179055505b505050565b600060cb60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b610f4d6117ba565b73ffffffffffffffffffffffffffffffffffffffff16610f6b610fcd565b73ffffffffffffffffffffffffffffffffffffffff1614610fc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb8906129be565b60405180910390fd5b610fcb6000611b7d565b565b6000609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b61108c7f4f50455241544f5200000000000000000000000000000000000000000000000033610ff7565b6110cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110c29061289e565b60405180910390fd5b806110f67f414d4241535341444f520000000000000000000000000000000000000000000082610ff7565b15611136576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161112d90612a1e565b60405180910390fd5b81600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156111a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161119e9061291e565b60405180910390fd5b6111d17f414d4241535341444f520000000000000000000000000000000000000000000084610739565b505050565b60006112027f414d4241535341444f520000000000000000000000000000000000000000000083610ff7565b9050919050565b6000801b81565b600061123c7f4d454d424552000000000000000000000000000000000000000000000000000083610ff7565b9050919050565b61126d7f4f50455241544f5200000000000000000000000000000000000000000000000033610ff7565b6112ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112a39061289e565b60405180910390fd5b806112d77f414d4241535341444f520000000000000000000000000000000000000000000082610ff7565b611316576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161130d906128be565b60405180910390fd5b81600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611387576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161137e9061291e565b60405180910390fd5b6113b17f414d4241535341444f5200000000000000000000000000000000000000000000846114a5565b505050565b6113c36000801b33610ff7565b611402576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113f99061293e565b60405180910390fd5b61140a610fcd565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611478576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161146f906129fe565b60405180910390fd5b6114a27f4f50455241544f52000000000000000000000000000000000000000000000000826114a5565b50565b6114ae826104a7565b6114bf816114ba6117ba565b6117c2565b6114c98383611940565b505050565b806114f97f4f50455241544f5200000000000000000000000000000000000000000000000082610ff7565b15611539576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611530906129de565b60405180910390fd5b81600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156115aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115a19061291e565b60405180910390fd5b6115b76000801b33610ff7565b6115f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ed9061293e565b60405180910390fd5b6116207f4f50455241544f5200000000000000000000000000000000000000000000000084610739565b505050565b60006116517f4f50455241544f5200000000000000000000000000000000000000000000000083610ff7565b9050919050565b6116606117ba565b73ffffffffffffffffffffffffffffffffffffffff1661167e610fcd565b73ffffffffffffffffffffffffffffffffffffffff16146116d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116cb906129be565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611744576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161173b906128fe565b60405180910390fd5b61174d81611b7d565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b6117cc8282610ff7565b61185b576117f18173ffffffffffffffffffffffffffffffffffffffff166014611c43565b6117ff8360001c6020611c43565b60405160200161181092919061277e565b6040516020818303038152906040526040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611852919061285c565b60405180910390fd5b5050565b6118698282610ff7565b61193c5760016065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506118e16117ba565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b61194a8282610ff7565b15611a1e5760006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506119c36117ba565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b600060019054906101000a900460ff1680611a48575060008054906101000a900460ff16155b611a87576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a7e9061299e565b60405180910390fd5b60008060019054906101000a900460ff161590508015611ad7576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b611adf611e7f565b611ae7611f58565b611aef612031565b8015611b105760008060016101000a81548160ff0219169083151502179055505b50565b611b1d828261185f565b5050565b6000611b2c836104a7565b90508160656000858152602001908152602001600020600101819055508181847fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff60405160405180910390a4505050565b6000609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081609760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b606060006002836002611c569190612b65565b611c609190612b0f565b67ffffffffffffffff811115611c7957611c78612d72565b5b6040519080825280601f01601f191660200182016040528015611cab5781602001600182028036833780820191505090505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110611ce357611ce2612d43565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611d4757611d46612d43565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006001846002611d879190612b65565b611d919190612b0f565b90505b6001811115611e31577f3031323334353637383961626364656600000000000000000000000000000000600f861660108110611dd357611dd2612d43565b5b1a60f81b828281518110611dea57611de9612d43565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c945080611e2a90612c70565b9050611d94565b5060008414611e75576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e6c9061287e565b60405180910390fd5b8091505092915050565b600060019054906101000a900460ff1680611ea5575060008054906101000a900460ff16155b611ee4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611edb9061299e565b60405180910390fd5b60008060019054906101000a900460ff161590508015611f34576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015611f555760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611f7e575060008054906101000a900460ff16155b611fbd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611fb49061299e565b60405180910390fd5b60008060019054906101000a900460ff16159050801561200d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561202e5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680612057575060008054906101000a900460ff16155b612096576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161208d9061299e565b60405180910390fd5b60008060019054906101000a900460ff1615905080156120e6576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156121075760008060016101000a81548160ff0219169083151502179055505b50565b600061211d61211884612a83565b612a5e565b905080838252602082019050828560208602820111156121405761213f612da6565b5b60005b858110156121705781612156888261217a565b845260208401935060208301925050600181019050612143565b5050509392505050565b60008135905061218981613221565b92915050565b60008151905061219e81613221565b92915050565b600082601f8301126121b9576121b8612da1565b5b81356121c984826020860161210a565b91505092915050565b6000813590506121e181613238565b92915050565b6000813590506121f68161324f565b92915050565b60008135905061220b81613266565b92915050565b60006020828403121561222757612226612db0565b5b60006122358482850161217a565b91505092915050565b60006020828403121561225457612253612db0565b5b60006122628482850161218f565b91505092915050565b6000806040838503121561228257612281612db0565b5b600083013567ffffffffffffffff8111156122a05761229f612dab565b5b6122ac858286016121a4565b92505060206122bd8582860161217a565b9150509250929050565b600080600080608085870312156122e1576122e0612db0565b5b600085013567ffffffffffffffff8111156122ff576122fe612dab565b5b61230b878288016121a4565b945050602085013567ffffffffffffffff81111561232c5761232b612dab565b5b612338878288016121a4565b93505060406123498782880161217a565b925050606061235a878288016121fc565b91505092959194509250565b60006020828403121561237c5761237b612db0565b5b600061238a848285016121d2565b91505092915050565b600080604083850312156123aa576123a9612db0565b5b60006123b8858286016121d2565b92505060206123c98582860161217a565b9150509250929050565b6000602082840312156123e9576123e8612db0565b5b60006123f7848285016121e7565b91505092915050565b600061240c8383612418565b60208301905092915050565b61242181612bbf565b82525050565b61243081612bbf565b82525050565b600061244182612abf565b61244b8185612ae2565b935061245683612aaf565b8060005b8381101561248757815161246e8882612400565b975061247983612ad5565b92505060018101905061245a565b5085935050505092915050565b61249d81612bd1565b82525050565b6124ac81612bdd565b82525050565b60006124bd82612aca565b6124c78185612af3565b93506124d7818560208601612c3d565b6124e081612db5565b840191505092915050565b60006124f682612aca565b6125008185612b04565b9350612510818560208601612c3d565b80840191505092915050565b6000612529602083612af3565b915061253482612dc6565b602082019050919050565b600061254c602583612af3565b915061255782612def565b604082019050919050565b600061256f602783612af3565b915061257a82612e3e565b604082019050919050565b6000612592602483612af3565b915061259d82612e8d565b604082019050919050565b60006125b5602683612af3565b91506125c082612edc565b604082019050919050565b60006125d8601883612af3565b91506125e382612f2b565b602082019050919050565b60006125fb602183612af3565b915061260682612f54565b604082019050919050565b600061261e602783612af3565b915061262982612fa3565b604082019050919050565b6000612641602483612af3565b915061264c82612ff2565b604082019050919050565b6000612664602e83612af3565b915061266f82613041565b604082019050919050565b6000612687602083612af3565b915061269282613090565b602082019050919050565b60006126aa602583612af3565b91506126b5826130b9565b604082019050919050565b60006126cd601b83612af3565b91506126d882613108565b602082019050919050565b60006126f0601783612b04565b91506126fb82613131565b601782019050919050565b6000612713602783612af3565b915061271e8261315a565b604082019050919050565b6000612736601183612b04565b9150612741826131a9565b601182019050919050565b6000612759602f83612af3565b9150612764826131d2565b604082019050919050565b61277881612c33565b82525050565b6000612789826126e3565b915061279582856124eb565b91506127a082612729565b91506127ac82846124eb565b91508190509392505050565b60006020820190506127cd6000830184612427565b92915050565b600060808201905081810360008301526127ed8187612436565b905081810360208301526128018186612436565b90506128106040830185612427565b61281d606083018461276f565b95945050505050565b600060208201905061283b6000830184612494565b92915050565b600060208201905061285660008301846124a3565b92915050565b6000602082019050818103600083015261287681846124b2565b905092915050565b600060208201905081810360008301526128978161251c565b9050919050565b600060208201905081810360008301526128b78161253f565b9050919050565b600060208201905081810360008301526128d781612562565b9050919050565b600060208201905081810360008301526128f781612585565b9050919050565b60006020820190508181036000830152612917816125a8565b9050919050565b60006020820190508181036000830152612937816125cb565b9050919050565b60006020820190508181036000830152612957816125ee565b9050919050565b6000602082019050818103600083015261297781612611565b9050919050565b6000602082019050818103600083015261299781612634565b9050919050565b600060208201905081810360008301526129b781612657565b9050919050565b600060208201905081810360008301526129d78161267a565b9050919050565b600060208201905081810360008301526129f78161269d565b9050919050565b60006020820190508181036000830152612a17816126c0565b9050919050565b60006020820190508181036000830152612a3781612706565b9050919050565b60006020820190508181036000830152612a578161274c565b9050919050565b6000612a68612a79565b9050612a748282612c9a565b919050565b6000604051905090565b600067ffffffffffffffff821115612a9e57612a9d612d72565b5b602082029050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612b1a82612c33565b9150612b2583612c33565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612b5a57612b59612d14565b5b828201905092915050565b6000612b7082612c33565b9150612b7b83612c33565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612bb457612bb3612d14565b5b828202905092915050565b6000612bca82612c13565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015612c5b578082015181840152602081019050612c40565b83811115612c6a576000848401525b50505050565b6000612c7b82612c33565b91506000821415612c8f57612c8e612d14565b5b600182039050919050565b612ca382612db5565b810181811067ffffffffffffffff82111715612cc257612cc1612d72565b5b80604052505050565b6000612cd682612c33565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612d0957612d08612d14565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b7f4e6574776f726b526f6c65733a206f70657261746f7220646f6573206e6f742060008201527f6578697374000000000000000000000000000000000000000000000000000000602082015250565b7f4e6574776f726b526f6c65733a20616d6261737361646f7220646f6573206e6f60008201527f7420657869737400000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a20496e7669746520646f6573206e6f74206560008201527f7869737400000000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f696e76616c6964206f70657261746f7220616464726573730000000000000000600082015250565b7f4e6574776f726b526f6c65733a204f6e6c792061646d696e2063616e2063616c60008201527f6c00000000000000000000000000000000000000000000000000000000000000602082015250565b7f4e6574776f726b526f6c65733a204f6e6c7920616d6261737361646f7273206360008201527f616e2063616c6c00000000000000000000000000000000000000000000000000602082015250565b7f437265646974526571756573743a20496e7669746520616c726561647920657860008201527f6973747300000000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4e6574776f726b526f6c65733a206f70657261746f7220616c7265616479206560008201527f7869737473000000000000000000000000000000000000000000000000000000602082015250565b7f63616e27742072656d6f7665206f776e6572206f70657261746f720000000000600082015250565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b7f4e6574776f726b526f6c65733a20616d6261737361646f7220616c726561647960008201527f2065786973747300000000000000000000000000000000000000000000000000602082015250565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b61322a81612bbf565b811461323557600080fd5b50565b61324181612bdd565b811461324c57600080fd5b50565b61325881612be7565b811461326357600080fd5b50565b61326f81612c33565b811461327a57600080fd5b5056fea2646970667358221220e9261fbbf000651274e3b6bf001f5e64ec1ea6a710d638daebabc7f908028fe564736f6c63430008070033";

export class NetworkRoles__factory extends ContractFactory {
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
  ): Promise<NetworkRoles> {
    return super.deploy(overrides || {}) as Promise<NetworkRoles>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NetworkRoles {
    return super.attach(address) as NetworkRoles;
  }
  connect(signer: Signer): NetworkRoles__factory {
    return super.connect(signer) as NetworkRoles__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NetworkRolesInterface {
    return new utils.Interface(_abi) as NetworkRolesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NetworkRoles {
    return new Contract(address, _abi, signerOrProvider) as NetworkRoles;
  }
}
