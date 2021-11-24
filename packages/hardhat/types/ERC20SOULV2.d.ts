/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ERC20SOULV2Interface extends ethers.utils.Interface {
  functions: {
    "addStakeableContract(address)": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "getLockSchedules(address)": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "initializeERC20SOUL(string,string,uint256,address[])": FunctionFragment;
    "isStakeableContract(address)": FunctionFragment;
    "lockedBalanceOf(address)": FunctionFragment;
    "locks(address)": FunctionFragment;
    "maxLockTime()": FunctionFragment;
    "maxSchedules()": FunctionFragment;
    "minLockTime()": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "refundLockedTokensToOwner()": FunctionFragment;
    "removeStakeableContract(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setMaxLockTime(uint256)": FunctionFragment;
    "setMaxSchedules(uint256)": FunctionFragment;
    "setMinLockTime(uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "transferWithLock(address,(uint256,uint256,tuple[]))": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addStakeableContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getLockSchedules",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeERC20SOUL",
    values: [string, string, BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "isStakeableContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "lockedBalanceOf",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "locks", values: [string]): string;
  encodeFunctionData(
    functionFragment: "maxLockTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxSchedules",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minLockTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refundLockedTokensToOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeStakeableContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxLockTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxSchedules",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinLockTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferWithLock",
    values: [
      string,
      {
        totalAmount: BigNumberish;
        amountStaked: BigNumberish;
        schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
      }
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addStakeableContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLockSchedules",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeERC20SOUL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isStakeableContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockedBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "locks", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxLockTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxSchedules",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minLockTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refundLockedTokensToOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeStakeableContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxLockTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxSchedules",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinLockTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferWithLock",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "LockExpired(address,tuple)": EventFragment;
    "LockScheduleExpired(address,tuple)": EventFragment;
    "LockedTransfer(tuple,address,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockExpired"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockScheduleExpired"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockedTransfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;

export type LockExpiredEvent = TypedEvent<
  [
    string,
    [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    }
  ] & {
    owner: string;
    lock: [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    };
  }
>;

export type LockScheduleExpiredEvent = TypedEvent<
  [
    string,
    [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    }
  ] & {
    owner: string;
    lock: [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    };
  }
>;

export type LockedTransferEvent = TypedEvent<
  [
    [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    },
    string,
    string
  ] & {
    lock: [
      BigNumber,
      BigNumber,
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    ] & {
      totalAmount: BigNumber;
      amountStaked: BigNumber;
      schedules: ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[];
    };
    sender: string;
    recipient: string;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export class ERC20SOULV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ERC20SOULV2Interface;

  functions: {
    addStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getLockSchedules(
      owner: string,
      overrides?: CallOverrides
    ): Promise<
      [
        ([BigNumber, BigNumber] & {
          amount: BigNumber;
          expirationBlock: BigNumber;
        })[]
      ]
    >;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initializeERC20SOUL(
      name: string,
      symbol: string,
      initialSupply: BigNumberish,
      stakeableContracts: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isStakeableContract(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    lockedBalanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    locks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        totalAmount: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    maxLockTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxSchedules(overrides?: CallOverrides): Promise<[BigNumber]>;

    minLockTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    refundLockedTokensToOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxLockTime(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxSchedules(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinLockTime(
      _newMin: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferWithLock(
      _to: string,
      _lock: {
        totalAmount: BigNumberish;
        amountStaked: BigNumberish;
        schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addStakeableContract(
    stakingContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getLockSchedules(
    owner: string,
    overrides?: CallOverrides
  ): Promise<
    ([BigNumber, BigNumber] & {
      amount: BigNumber;
      expirationBlock: BigNumber;
    })[]
  >;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initializeERC20SOUL(
    name: string,
    symbol: string,
    initialSupply: BigNumberish,
    stakeableContracts: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isStakeableContract(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  lockedBalanceOf(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  locks(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { totalAmount: BigNumber; amountStaked: BigNumber }
  >;

  maxLockTime(overrides?: CallOverrides): Promise<BigNumber>;

  maxSchedules(overrides?: CallOverrides): Promise<BigNumber>;

  minLockTime(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  refundLockedTokensToOwner(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeStakeableContract(
    stakingContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxLockTime(
    _newMax: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxSchedules(
    _newMax: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinLockTime(
    _newMin: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferWithLock(
    _to: string,
    _lock: {
      totalAmount: BigNumberish;
      amountStaked: BigNumberish;
      schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addStakeableContract(
      stakingContract: string,
      overrides?: CallOverrides
    ): Promise<void>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getLockSchedules(
      owner: string,
      overrides?: CallOverrides
    ): Promise<
      ([BigNumber, BigNumber] & {
        amount: BigNumber;
        expirationBlock: BigNumber;
      })[]
    >;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initializeERC20SOUL(
      name: string,
      symbol: string,
      initialSupply: BigNumberish,
      stakeableContracts: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    isStakeableContract(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lockedBalanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    locks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        totalAmount: BigNumber;
        amountStaked: BigNumber;
      }
    >;

    maxLockTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxSchedules(overrides?: CallOverrides): Promise<BigNumber>;

    minLockTime(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    refundLockedTokensToOwner(overrides?: CallOverrides): Promise<void>;

    removeStakeableContract(
      stakingContract: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setMaxLockTime(
      _newMax: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxSchedules(
      _newMax: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinLockTime(
      _newMin: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferWithLock(
      _to: string,
      _lock: {
        totalAmount: BigNumberish;
        amountStaked: BigNumberish;
        schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
      },
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    "LockExpired(address,tuple)"(
      owner?: null,
      lock?: null
    ): TypedEventFilter<
      [
        string,
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        }
      ],
      {
        owner: string;
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
      }
    >;

    LockExpired(
      owner?: null,
      lock?: null
    ): TypedEventFilter<
      [
        string,
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        }
      ],
      {
        owner: string;
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
      }
    >;

    "LockScheduleExpired(address,tuple)"(
      owner?: null,
      lock?: null
    ): TypedEventFilter<
      [
        string,
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        }
      ],
      {
        owner: string;
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
      }
    >;

    LockScheduleExpired(
      owner?: null,
      lock?: null
    ): TypedEventFilter<
      [
        string,
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        }
      ],
      {
        owner: string;
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
      }
    >;

    "LockedTransfer(tuple,address,address)"(
      lock?: null,
      sender?: null,
      recipient?: null
    ): TypedEventFilter<
      [
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        },
        string,
        string
      ],
      {
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
        sender: string;
        recipient: string;
      }
    >;

    LockedTransfer(
      lock?: null,
      sender?: null,
      recipient?: null
    ): TypedEventFilter<
      [
        [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        },
        string,
        string
      ],
      {
        lock: [
          BigNumber,
          BigNumber,
          ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[]
        ] & {
          totalAmount: BigNumber;
          amountStaked: BigNumber;
          schedules: ([BigNumber, BigNumber] & {
            amount: BigNumber;
            expirationBlock: BigNumber;
          })[];
        };
        sender: string;
        recipient: string;
      }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;
  };

  estimateGas: {
    addStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getLockSchedules(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initializeERC20SOUL(
      name: string,
      symbol: string,
      initialSupply: BigNumberish,
      stakeableContracts: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isStakeableContract(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lockedBalanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    locks(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxLockTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxSchedules(overrides?: CallOverrides): Promise<BigNumber>;

    minLockTime(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    refundLockedTokensToOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxLockTime(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxSchedules(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinLockTime(
      _newMin: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferWithLock(
      _to: string,
      _lock: {
        totalAmount: BigNumberish;
        amountStaked: BigNumberish;
        schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getLockSchedules(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initializeERC20SOUL(
      name: string,
      symbol: string,
      initialSupply: BigNumberish,
      stakeableContracts: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isStakeableContract(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockedBalanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    locks(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxLockTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxSchedules(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minLockTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    refundLockedTokensToOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeStakeableContract(
      stakingContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxLockTime(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxSchedules(
      _newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinLockTime(
      _newMin: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferWithLock(
      _to: string,
      _lock: {
        totalAmount: BigNumberish;
        amountStaked: BigNumberish;
        schedules: { amount: BigNumberish; expirationBlock: BigNumberish }[];
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
