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

interface UnderwriteManagerV3Interface extends ethers.utils.Interface {
  functions: {
    "calculateLTV(address,address)": FunctionFragment;
    "closeCreditLine(address,address)": FunctionFragment;
    "collateralToken()": FunctionFragment;
    "convertNetworkToCollateral(address,uint256)": FunctionFragment;
    "createCreditLine(address,address,uint256,uint256,address)": FunctionFragment;
    "creditLineExpiration()": FunctionFragment;
    "creditLines(address,address)": FunctionFragment;
    "depositAndStakeCollateral(address,address,address,uint256)": FunctionFragment;
    "depositCollateral(address,uint256)": FunctionFragment;
    "deposits(address)": FunctionFragment;
    "extendCreditLine(address,address,address,uint256,uint256)": FunctionFragment;
    "getCollateralToken()": FunctionFragment;
    "getCreditLine(address,address)": FunctionFragment;
    "getMinLTV()": FunctionFragment;
    "getNeededCollateral(address,address)": FunctionFragment;
    "initialize(address,address,address)": FunctionFragment;
    "isCreditLineExpired(address,address)": FunctionFragment;
    "isValidLTV(address,address)": FunctionFragment;
    "minLTV()": FunctionFragment;
    "oracle()": FunctionFragment;
    "owner()": FunctionFragment;
    "paused()": FunctionFragment;
    "protocolRoles()": FunctionFragment;
    "registerCreditRequest(address)": FunctionFragment;
    "renewCreditLine(address,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "stakeCollateral(address,address,address,uint256)": FunctionFragment;
    "swapCreditLineUnderwriter(address,address,address)": FunctionFragment;
    "totalCollateral()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unstakeAndWithdrawCollateral(address,address,uint256)": FunctionFragment;
    "unstakeCollateral(address,address,uint256)": FunctionFragment;
    "withdrawCollateral(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateLTV",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "closeCreditLine",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "collateralToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "convertNetworkToCollateral",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createCreditLine",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "creditLineExpiration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "creditLines",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositAndStakeCollateral",
    values: [string, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositCollateral",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "deposits", values: [string]): string;
  encodeFunctionData(
    functionFragment: "extendCreditLine",
    values: [string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCollateralToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCreditLine",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "getMinLTV", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getNeededCollateral",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isCreditLineExpired",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidLTV",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "minLTV", values?: undefined): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "protocolRoles",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registerCreditRequest",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renewCreditLine",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakeCollateral",
    values: [string, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapCreditLineUnderwriter",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalCollateral",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "unstakeAndWithdrawCollateral",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unstakeCollateral",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawCollateral",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateLTV",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "closeCreditLine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertNetworkToCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createCreditLine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "creditLineExpiration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "creditLines",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositAndStakeCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposits", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extendCreditLine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCollateralToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCreditLine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getMinLTV", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getNeededCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isCreditLineExpired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isValidLTV", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "minLTV", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolRoles",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerCreditRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renewCreditLine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakeCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapCreditLineUnderwriter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unstakeAndWithdrawCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unstakeCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawCollateral",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type PausedEvent = TypedEvent<[string] & { account: string }>;

export type UnpausedEvent = TypedEvent<[string] & { account: string }>;

export class UnderwriteManagerV3 extends BaseContract {
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

  interface: UnderwriteManagerV3Interface;

  functions: {
    calculateLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    closeCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collateralToken(overrides?: CallOverrides): Promise<[string]>;

    convertNetworkToCollateral(
      _network: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    createCreditLine(
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    creditLineExpiration(overrides?: CallOverrides): Promise<[BigNumber]>;

    creditLines(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        underwriter: string;
        network: string;
        collateral: BigNumber;
        issueDate: BigNumber;
      }
    >;

    depositAndStakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositCollateral(
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposits(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    extendCreditLine(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCollateralToken(overrides?: CallOverrides): Promise<[string]>;

    getCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber, BigNumber] & {
          underwriter: string;
          network: string;
          collateral: BigNumber;
          issueDate: BigNumber;
        }
      ]
    >;

    getMinLTV(overrides?: CallOverrides): Promise<[BigNumber]>;

    getNeededCollateral(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      collateralTokenAddress: string,
      _protocolRoles: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isCreditLineExpired(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isValidLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    minLTV(overrides?: CallOverrides): Promise<[BigNumber]>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    protocolRoles(overrides?: CallOverrides): Promise<[string]>;

    registerCreditRequest(
      _creditRequest: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renewCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapCreditLineUnderwriter(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalCollateral(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unstakeAndWithdrawCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unstakeCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawCollateral(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  calculateLTV(
    _network: string,
    _counterparty: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  closeCreditLine(
    _network: string,
    _counterparty: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collateralToken(overrides?: CallOverrides): Promise<string>;

  convertNetworkToCollateral(
    _network: string,
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  createCreditLine(
    _counterparty: string,
    _underwriter: string,
    _collateral: BigNumberish,
    _creditLimit: BigNumberish,
    _network: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  creditLineExpiration(overrides?: CallOverrides): Promise<BigNumber>;

  creditLines(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber] & {
      underwriter: string;
      network: string;
      collateral: BigNumber;
      issueDate: BigNumber;
    }
  >;

  depositAndStakeCollateral(
    _network: string,
    _counterparty: string,
    _underwriter: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositCollateral(
    _underwriter: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  extendCreditLine(
    _network: string,
    _counterparty: string,
    _underwriter: string,
    _collateral: BigNumberish,
    _creditLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCollateralToken(overrides?: CallOverrides): Promise<string>;

  getCreditLine(
    _network: string,
    _counterparty: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber] & {
      underwriter: string;
      network: string;
      collateral: BigNumber;
      issueDate: BigNumber;
    }
  >;

  getMinLTV(overrides?: CallOverrides): Promise<BigNumber>;

  getNeededCollateral(
    _network: string,
    _counterparty: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    collateralTokenAddress: string,
    _protocolRoles: string,
    _oracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isCreditLineExpired(
    _network: string,
    _counterparty: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isValidLTV(
    _network: string,
    _counterparty: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  minLTV(overrides?: CallOverrides): Promise<BigNumber>;

  oracle(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  protocolRoles(overrides?: CallOverrides): Promise<string>;

  registerCreditRequest(
    _creditRequest: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renewCreditLine(
    _network: string,
    _counterparty: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakeCollateral(
    _network: string,
    _counterparty: string,
    _underwriter: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapCreditLineUnderwriter(
    _network: string,
    _counterparty: string,
    _underwriter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalCollateral(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unstakeAndWithdrawCollateral(
    _network: string,
    _counterparty: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unstakeCollateral(
    _network: string,
    _counterparty: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawCollateral(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    calculateLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    closeCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<void>;

    collateralToken(overrides?: CallOverrides): Promise<string>;

    convertNetworkToCollateral(
      _network: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createCreditLine(
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      _network: string,
      overrides?: CallOverrides
    ): Promise<void>;

    creditLineExpiration(overrides?: CallOverrides): Promise<BigNumber>;

    creditLines(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        underwriter: string;
        network: string;
        collateral: BigNumber;
        issueDate: BigNumber;
      }
    >;

    depositAndStakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    depositCollateral(
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    deposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    extendCreditLine(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getCollateralToken(overrides?: CallOverrides): Promise<string>;

    getCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        underwriter: string;
        network: string;
        collateral: BigNumber;
        issueDate: BigNumber;
      }
    >;

    getMinLTV(overrides?: CallOverrides): Promise<BigNumber>;

    getNeededCollateral(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      collateralTokenAddress: string,
      _protocolRoles: string,
      _oracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isCreditLineExpired(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isValidLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    minLTV(overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    protocolRoles(overrides?: CallOverrides): Promise<string>;

    registerCreditRequest(
      _creditRequest: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renewCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    stakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    swapCreditLineUnderwriter(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    totalCollateral(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unstakeAndWithdrawCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    unstakeCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawCollateral(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
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

    "Paused(address)"(
      account?: null
    ): TypedEventFilter<[string], { account: string }>;

    Paused(account?: null): TypedEventFilter<[string], { account: string }>;

    "Unpaused(address)"(
      account?: null
    ): TypedEventFilter<[string], { account: string }>;

    Unpaused(account?: null): TypedEventFilter<[string], { account: string }>;
  };

  estimateGas: {
    calculateLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    closeCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collateralToken(overrides?: CallOverrides): Promise<BigNumber>;

    convertNetworkToCollateral(
      _network: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createCreditLine(
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    creditLineExpiration(overrides?: CallOverrides): Promise<BigNumber>;

    creditLines(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositAndStakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositCollateral(
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    extendCreditLine(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCollateralToken(overrides?: CallOverrides): Promise<BigNumber>;

    getCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMinLTV(overrides?: CallOverrides): Promise<BigNumber>;

    getNeededCollateral(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      collateralTokenAddress: string,
      _protocolRoles: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isCreditLineExpired(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    minLTV(overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    protocolRoles(overrides?: CallOverrides): Promise<BigNumber>;

    registerCreditRequest(
      _creditRequest: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renewCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapCreditLineUnderwriter(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalCollateral(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unstakeAndWithdrawCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unstakeCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawCollateral(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    closeCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collateralToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    convertNetworkToCollateral(
      _network: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createCreditLine(
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    creditLineExpiration(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    creditLines(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    depositAndStakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositCollateral(
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposits(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    extendCreditLine(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _collateral: BigNumberish,
      _creditLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCollateralToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMinLTV(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getNeededCollateral(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      collateralTokenAddress: string,
      _protocolRoles: string,
      _oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isCreditLineExpired(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidLTV(
      _network: string,
      _counterparty: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minLTV(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolRoles(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registerCreditRequest(
      _creditRequest: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renewCreditLine(
      _network: string,
      _counterparty: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakeCollateral(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapCreditLineUnderwriter(
      _network: string,
      _counterparty: string,
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalCollateral(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unstakeAndWithdrawCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unstakeCollateral(
      _network: string,
      _counterparty: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawCollateral(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
