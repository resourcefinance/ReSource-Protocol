/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CreditFeeManager,
  CreditFeeManagerInterface,
} from "../CreditFeeManager";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "network",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "member",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalFee",
        type: "uint256",
      },
    ],
    name: "FeesCollected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    name: "OperatorFeesClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    name: "OperatorRewardsUpdated",
    type: "event",
  },
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
        name: "underwriter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    name: "PoolRewardsUpdated",
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
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    name: "UnderwriterFeesClaimed",
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
      {
        indexed: false,
        internalType: "uint256",
        name: "totalStaked",
        type: "uint256",
      },
    ],
    name: "UnderwriterRewardsStaked",
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
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    name: "UnderwriterRewardsUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_networkToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_percent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "calculatePercentInCollateral",
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
        internalType: "address[]",
        name: "_networkMembers",
        type: "address[]",
      },
    ],
    name: "claimOperatorFees",
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
        internalType: "address[]",
        name: "_networkMembers",
        type: "address[]",
      },
    ],
    name: "claimUnderwriterFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralToken",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
        name: "_networkMember",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_transactionValue",
        type: "uint256",
      },
    ],
    name: "collectFees",
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
    name: "creditRequest",
    outputs: [
      {
        internalType: "contract ICreditRequest",
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
    inputs: [],
    name: "getCollateralToken",
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
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_networkMember",
        type: "address",
      },
    ],
    name: "getUnderwriterPoolStakePercent",
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
        name: "_priceOracle",
        type: "address",
      },
      {
        internalType: "address",
        name: "_creditManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_creditRoles",
        type: "address",
      },
      {
        internalType: "address",
        name: "_creditRequest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_underwriterPercent",
        type: "uint256",
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
        name: "_network",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_networkMembers",
        type: "address[]",
      },
    ],
    name: "moveFeesToRewards",
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
    name: "priceOracle",
    outputs: [
      {
        internalType: "contract IPriceOracle",
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
    inputs: [],
    name: "underwriterFeePercent",
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
        name: "_feePercent",
        type: "uint256",
      },
    ],
    name: "updateUnderwriterFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506136a0806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063b2016bd4116100a2578063e00efe4a11610071578063e00efe4a14610297578063ed04b842146102b3578063f2fde38b146102d1578063f7013ef6146102ed578063fdd6eaff1461030957610116565b8063b2016bd41461020d578063c12c21c01461022b578063db3f00fe14610249578063dbac960c1461026757610116565b806364a51361116100e957806364a513611461018d578063715018a6146101a9578063801c2d1c146101b35780638da5cb5b146101d157806396423663146101ef57610116565b80632630c12f1461011b57806330a758ce146101395780635eb9da2c146101555780636220f53d14610171575b600080fd5b610123610339565b6040516101309190612d63565b60405180910390f35b610153600480360381019061014e9190612957565b61035f565b005b61016f600480360381019061016a919061284e565b6104ac565b005b61018b6004803603810190610186919061284e565b610904565b005b6101a760048036038101906101a2919061284e565b610b93565b005b6101b1610dd4565b005b6101bb610e5c565b6040516101c89190612f00565b60405180910390f35b6101d9610e62565b6040516101e69190612c1c565b60405180910390f35b6101f7610e8c565b6040516102049190612c1c565b60405180910390f35b610215610eb6565b6040516102229190612d48565b60405180910390f35b610233610edc565b6040516102409190612cf7565b60405180910390f35b610251610f02565b60405161025e9190612d2d565b60405180910390f35b610281600480360381019061027c91906128aa565b610f28565b60405161028e9190612f00565b60405180910390f35b6102b160048036038101906102ac91906127fb565b610fe4565b005b6102bb611281565b6040516102c89190612d12565b60405180910390f35b6102eb60048036038101906102e691906126e6565b6112a7565b005b61030760048036038101906103029190612780565b61139f565b005b610323600480360381019061031e9190612740565b6116be565b6040516103309190612f00565b60405180910390f35b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632ccd3ce0336040518263ffffffff1660e01b81526004016103ba9190612c1c565b60206040518083038186803b1580156103d257600080fd5b505afa1580156103e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061040a91906128fd565b610449576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044090612e20565b60405180910390fd5b620f424063ffffffff168111158015610463575060008110155b6104a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049990612dc0565b60405180910390fd5b80606a8190555050565b60005b81518110156108fe576000606b60008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084848151811061050e5761050d613284565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000606b60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008585815181106105a9576105a8613284565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1f094a88686868151811061064357610642613284565b5b60200260200101516040518363ffffffff1660e01b8152600401610668929190612c37565b602060405180830381600087803b15801561068257600080fd5b505af1158015610696573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ba9190612713565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156107c55781606c60003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107409190612f9e565b925050819055507f67d1de1c073d5d4afbc105a02388194642d26c2df77331e20391e19ff823ec2b606c60003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040516107b59190612f00565b60405180910390a1505050610900565b6000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166302d7bbff8787878151811061081957610818613284565b5b60200260200101516040518363ffffffff1660e01b815260040161083e929190612c37565b6040805180830381600087803b15801561085757600080fd5b505af115801561086b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088f919061292a565b60000151905060006108be878787815181106108ae576108ad613284565b5b6020026020010151848688611963565b90506108e7878787815181106108d7576108d6613284565b5b6020026020010151858585611ce8565b5050505080806108f6906131dd565b9150506104af565b505b5050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166341ebc686336040518263ffffffff1660e01b815260040161095f9190612c1c565b60206040518083038186803b15801561097757600080fd5b505afa15801561098b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109af91906128fd565b6109ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e590612de0565b60405180910390fd5b6109f882826104ac565b6000606c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610a4557610b8f565b610ad133606c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611e9a9092919063ffffffff16565b7f3f2e0317638ebd15467aa838c534d58feafeb8ba3511ef8a6348bb5a37d86a2d33606c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051610b41929190612c97565b60405180910390a16000606c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632ccd3ce0336040518263ffffffff1660e01b8152600401610bee9190612c1c565b60206040518083038186803b158015610c0657600080fd5b505afa158015610c1a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c3e91906128fd565b610c7d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c7490612e20565b60405180910390fd5b610c8782826104ac565b610d1333606c60003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611e9a9092919063ffffffff16565b7f7f067c4abdf41aaf58b115353d8433804947aa51b69dddd5a40c611e044c0ffd33606c60003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051610d83929190612c97565b60405180910390a16000606c60003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b610ddc611f20565b73ffffffffffffffffffffffffffffffffffffffff16610dfa610e62565b73ffffffffffffffffffffffffffffffffffffffff1614610e50576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e4790612e80565b60405180910390fd5b610e5a6000611f28565b565b606a5481565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dbac960c8585856040518463ffffffff1660e01b8152600401610f8993929190612cc0565b602060405180830381600087803b158015610fa357600080fd5b505af1158015610fb7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fdb9190612984565b90509392505050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634d610b58336040518263ffffffff1660e01b815260040161103f9190612c1c565b60206040518083038186803b15801561105757600080fd5b505afa15801561106b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061108f91906128fd565b6110ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110c590612ea0565b60405180910390fd5b60006110dd84606a5484610f28565b905061112e833083606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611fee909392919063ffffffff16565b606960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8a1f0a88585856040518463ffffffff1660e01b815260040161118d93929190612c60565b600060405180830381600087803b1580156111a757600080fd5b505af11580156111bb573d6000803e3d6000fd5b5050505080606b60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f9bcb6d1f38f6800906185471a11ede9a8e16200853225aa62558db6076490f2d84848360405161127393929190612c60565b60405180910390a150505050565b606960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6112af611f20565b73ffffffffffffffffffffffffffffffffffffffff166112cd610e62565b73ffffffffffffffffffffffffffffffffffffffff1614611323576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161131a90612e80565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611393576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161138a90612e00565b60405180910390fd5b61139c81611f28565b50565b600060019054906101000a900460ff16806113c5575060008054906101000a900460ff16155b611404576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113fb90612e60565b60405180910390fd5b60008060019054906101000a900460ff161590508015611454576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61145c612077565b85606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663964236636040518163ffffffff1660e01b8152600401602060405180830381600087803b15801561154857600080fd5b505af115801561155c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115809190612713565b606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082606960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620f424063ffffffff1682111561168e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161168590612da0565b60405180910390fd5b81606a8190555080156116b65760008060016101000a81548160ff0219169083151502179055505b505050505050565b600080606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166302d7bbff85856040518363ffffffff1660e01b815260040161171e929190612c37565b6040805180830381600087803b15801561173757600080fd5b505af115801561174b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061176f919061292a565b6000015190506000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1f094a886866040518363ffffffff1660e01b81526004016117d4929190612c37565b602060405180830381600087803b1580156117ee57600080fd5b505af1158015611802573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118269190612713565b905060008273ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b81526004016118639190612c1c565b60206040518083038186803b15801561187b57600080fd5b505afa15801561188f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b39190612984565b905060008373ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156118fd57600080fd5b505afa158015611911573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119359190612984565b9050620f424063ffffffff16828261194d9190612ff4565b6119579190613025565b94505050505092915050565b6000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663fe13f8b287866040518363ffffffff1660e01b81526004016119c2929190612c37565b602060405180830381600087803b1580156119dc57600080fd5b505af11580156119f0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a1491906128fd565b15611a2157819050611cdf565b6000606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635ebb931388886040518363ffffffff1660e01b8152600401611a80929190612c37565b602060405180830381600087803b158015611a9a57600080fd5b505af1158015611aae573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ad29190612984565b905082811115611bd857611b298484606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611e9a9092919063ffffffff16565b8473ffffffffffffffffffffffffffffffffffffffff16632ee4090885856040518363ffffffff1660e01b8152600401611b64929190612c97565b600060405180830381600087803b158015611b7e57600080fd5b505af1158015611b92573d6000803e3d6000fd5b505050507fdab4bcd902dc9b50236424df8ec3dfd7b3101ae643b0f6a91f7f7ec2f8fe981c8484604051611bc7929190612c97565b60405180910390a160009250611cda565b611c258482606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16611e9a9092919063ffffffff16565b8473ffffffffffffffffffffffffffffffffffffffff16632ee4090885836040518363ffffffff1660e01b8152600401611c60929190612c97565b600060405180830381600087803b158015611c7a57600080fd5b505af1158015611c8e573d6000803e3d6000fd5b505050507fdab4bcd902dc9b50236424df8ec3dfd7b3101ae643b0f6a91f7f7ec2f8fe981c8482604051611cc3929190612c97565b60405180910390a18083611cd7919061307f565b92505b829150505b95945050505050565b6000811415611cf657611e93565b6000611d0286866116be565b90506000620f424063ffffffff168383611d1c9190613025565b611d269190612ff4565b905060008184611d36919061307f565b90508473ffffffffffffffffffffffffffffffffffffffff1663b66503cf606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836040518363ffffffff1660e01b8152600401611d95929190612c97565b600060405180830381600087803b158015611daf57600080fd5b505af1158015611dc3573d6000803e3d6000fd5b505050507faad2b941e169592ea3fbf8326ab78d4cb23a806827ab06ac4d86fc637522e72c8682604051611df8929190612c97565b60405180910390a181606c60008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611e4f9190612f9e565b925050819055507fc5f93537ac9171103e72db4c2d68b2e6bd5da56d38a8d1102542ed42a87f04c48683604051611e87929190612c97565b60405180910390a15050505b5050505050565b611f1b8363a9059cbb60e01b8484604051602401611eb9929190612c97565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050612160565b505050565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612071846323b872dd60e01b85858560405160240161200f93929190612c60565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050612160565b50505050565b600060019054906101000a900460ff168061209d575060008054906101000a900460ff16155b6120dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120d390612e60565b60405180910390fd5b60008060019054906101000a900460ff16159050801561212c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b612134612227565b61213c612300565b801561215d5760008060016101000a81548160ff0219169083151502179055505b50565b60006121c2826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166123e99092919063ffffffff16565b905060008151111561222257808060200190518101906121e291906128fd565b612221576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161221890612ee0565b60405180910390fd5b5b505050565b600060019054906101000a900460ff168061224d575060008054906101000a900460ff16155b61228c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161228390612e60565b60405180910390fd5b60008060019054906101000a900460ff1615905080156122dc576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156122fd5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680612326575060008054906101000a900460ff16155b612365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161235c90612e60565b60405180910390fd5b60008060019054906101000a900460ff1615905080156123b5576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6123c56123c0611f20565b611f28565b80156123e65760008060016101000a81548160ff0219169083151502179055505b50565b60606123f88484600085612401565b90509392505050565b606082471015612446576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161243d90612e40565b60405180910390fd5b61244f85612515565b61248e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161248590612ec0565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516124b79190612c05565b60006040518083038185875af1925050503d80600081146124f4576040519150601f19603f3d011682016040523d82523d6000602084013e6124f9565b606091505b5091509150612509828286612528565b92505050949350505050565b600080823b905060008111915050919050565b6060831561253857829050612588565b60008351111561254b5782518084602001fd5b816040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161257f9190612d7e565b60405180910390fd5b9392505050565b60006125a261259d84612f40565b612f1b565b905080838252602082019050828560208602820111156125c5576125c46132ec565b5b60005b858110156125f557816125db88826125ff565b8452602084019350602083019250506001810190506125c8565b5050509392505050565b60008135905061260e81613625565b92915050565b60008151905061262381613625565b92915050565b600082601f83011261263e5761263d6132e2565b5b813561264e84826020860161258f565b91505092915050565b6000815190506126668161363c565b92915050565b600060408284031215612682576126816132e7565b5b61268c6040612f1b565b9050600061269c84828501612614565b60008301525060206126b0848285016126d1565b60208301525092915050565b6000813590506126cb81613653565b92915050565b6000815190506126e081613653565b92915050565b6000602082840312156126fc576126fb6132f6565b5b600061270a848285016125ff565b91505092915050565b600060208284031215612729576127286132f6565b5b600061273784828501612614565b91505092915050565b60008060408385031215612757576127566132f6565b5b6000612765858286016125ff565b9250506020612776858286016125ff565b9150509250929050565b600080600080600060a0868803121561279c5761279b6132f6565b5b60006127aa888289016125ff565b95505060206127bb888289016125ff565b94505060406127cc888289016125ff565b93505060606127dd888289016125ff565b92505060806127ee888289016126bc565b9150509295509295909350565b600080600060608486031215612814576128136132f6565b5b6000612822868287016125ff565b9350506020612833868287016125ff565b9250506040612844868287016126bc565b9150509250925092565b60008060408385031215612865576128646132f6565b5b6000612873858286016125ff565b925050602083013567ffffffffffffffff811115612894576128936132f1565b5b6128a085828601612629565b9150509250929050565b6000806000606084860312156128c3576128c26132f6565b5b60006128d1868287016125ff565b93505060206128e2868287016126bc565b92505060406128f3868287016126bc565b9150509250925092565b600060208284031215612913576129126132f6565b5b600061292184828501612657565b91505092915050565b6000604082840312156129405761293f6132f6565b5b600061294e8482850161266c565b91505092915050565b60006020828403121561296d5761296c6132f6565b5b600061297b848285016126bc565b91505092915050565b60006020828403121561299a576129996132f6565b5b60006129a8848285016126d1565b91505092915050565b6129ba816130b3565b82525050565b60006129cb82612f6c565b6129d58185612f82565b93506129e5818560208601613179565b80840191505092915050565b6129fa816130fb565b82525050565b612a098161310d565b82525050565b612a188161311f565b82525050565b612a2781613131565b82525050565b612a3681613143565b82525050565b6000612a4782612f77565b612a518185612f8d565b9350612a61818560208601613179565b612a6a816132fb565b840191505092915050565b6000612a82603c83612f8d565b9150612a8d8261330c565b604082019050919050565b6000612aa5602583612f8d565b9150612ab08261335b565b604082019050919050565b6000612ac8602e83612f8d565b9150612ad3826133aa565b604082019050919050565b6000612aeb602683612f8d565b9150612af6826133f9565b604082019050919050565b6000612b0e602f83612f8d565b9150612b1982613448565b604082019050919050565b6000612b31602683612f8d565b9150612b3c82613497565b604082019050919050565b6000612b54602e83612f8d565b9150612b5f826134e6565b604082019050919050565b6000612b77602083612f8d565b9150612b8282613535565b602082019050919050565b6000612b9a602983612f8d565b9150612ba58261355e565b604082019050919050565b6000612bbd601d83612f8d565b9150612bc8826135ad565b602082019050919050565b6000612be0602a83612f8d565b9150612beb826135d6565b604082019050919050565b612bff816130f1565b82525050565b6000612c1182846129c0565b915081905092915050565b6000602082019050612c3160008301846129b1565b92915050565b6000604082019050612c4c60008301856129b1565b612c5960208301846129b1565b9392505050565b6000606082019050612c7560008301866129b1565b612c8260208301856129b1565b612c8f6040830184612bf6565b949350505050565b6000604082019050612cac60008301856129b1565b612cb96020830184612bf6565b9392505050565b6000606082019050612cd560008301866129b1565b612ce26020830185612bf6565b612cef6040830184612bf6565b949350505050565b6000602082019050612d0c60008301846129f1565b92915050565b6000602082019050612d276000830184612a00565b92915050565b6000602082019050612d426000830184612a0f565b92915050565b6000602082019050612d5d6000830184612a1e565b92915050565b6000602082019050612d786000830184612a2d565b92915050565b60006020820190508181036000830152612d988184612a3c565b905092915050565b60006020820190508181036000830152612db981612a75565b9050919050565b60006020820190508181036000830152612dd981612a98565b9050919050565b60006020820190508181036000830152612df981612abb565b9050919050565b60006020820190508181036000830152612e1981612ade565b9050919050565b60006020820190508181036000830152612e3981612b01565b9050919050565b60006020820190508181036000830152612e5981612b24565b9050919050565b60006020820190508181036000830152612e7981612b47565b9050919050565b60006020820190508181036000830152612e9981612b6a565b9050919050565b60006020820190508181036000830152612eb981612b8d565b9050919050565b60006020820190508181036000830152612ed981612bb0565b9050919050565b60006020820190508181036000830152612ef981612bd3565b9050919050565b6000602082019050612f156000830184612bf6565b92915050565b6000612f25612f36565b9050612f3182826131ac565b919050565b6000604051905090565b600067ffffffffffffffff821115612f5b57612f5a6132b3565b5b602082029050602081019050919050565b600081519050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b6000612fa9826130f1565b9150612fb4836130f1565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612fe957612fe8613226565b5b828201905092915050565b6000612fff826130f1565b915061300a836130f1565b92508261301a57613019613255565b5b828204905092915050565b6000613030826130f1565b915061303b836130f1565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561307457613073613226565b5b828202905092915050565b600061308a826130f1565b9150613095836130f1565b9250828210156130a8576130a7613226565b5b828203905092915050565b60006130be826130d1565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061310682613155565b9050919050565b600061311882613155565b9050919050565b600061312a82613155565b9050919050565b600061313c82613155565b9050919050565b600061314e82613155565b9050919050565b600061316082613167565b9050919050565b6000613172826130d1565b9050919050565b60005b8381101561319757808201518184015260208101905061317c565b838111156131a6576000848401525b50505050565b6131b5826132fb565b810181811067ffffffffffffffff821117156131d4576131d36132b3565b5b80604052505050565b60006131e8826130f1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561321b5761321a613226565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4372656469744665654d616e616765723a20756e64657277726974657220706560008201527f7263656e74206d757374206265206c657373207468616e203130302500000000602082015250565b7f4372656469744665654d616e616765723a20696e76616c69642066656520706560008201527f7263656e74000000000000000000000000000000000000000000000000000000602082015250565b7f4372656469744665654d616e616765723a2043616c6c6572206973206e6f742060008201527f616e20756e646572777269746572000000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4372656469744665654d616e616765723a2043616c6c6572206973206e6f742060008201527f637265646974206f70657261746f720000000000000000000000000000000000602082015250565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4372656469744665654d616e616765723a2043616c6c6572206973206e6f742060008201527f61206e6574776f726b0000000000000000000000000000000000000000000000602082015250565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b61362e816130b3565b811461363957600080fd5b50565b613645816130c5565b811461365057600080fd5b50565b61365c816130f1565b811461366757600080fd5b5056fea26469706673582212202b3f5ada18a9a592baa77cdba086ebbb73c967e164eeba0f22354a6b651bac2564736f6c63430008070033";

export class CreditFeeManager__factory extends ContractFactory {
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
  ): Promise<CreditFeeManager> {
    return super.deploy(overrides || {}) as Promise<CreditFeeManager>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CreditFeeManager {
    return super.attach(address) as CreditFeeManager;
  }
  connect(signer: Signer): CreditFeeManager__factory {
    return super.connect(signer) as CreditFeeManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CreditFeeManagerInterface {
    return new utils.Interface(_abi) as CreditFeeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CreditFeeManager {
    return new Contract(address, _abi, signerOrProvider) as CreditFeeManager;
  }
}
