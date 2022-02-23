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

interface ICreditFeeManagerInterface extends ethers.utils.Interface {
  functions: {
    "calculatePercentInCollateral(address,uint256,uint256)": FunctionFragment;
    "collectFees(address,address,uint256)": FunctionFragment;
    "getCollateralToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculatePercentInCollateral",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collectFees",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCollateralToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "calculatePercentInCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCollateralToken",
    data: BytesLike
  ): Result;

  events: {
    "FeesCollected(address,address,uint256)": EventFragment;
    "OperatorFeesClaimed(address,uint256)": EventFragment;
    "OperatorRewardsUpdated(uint256)": EventFragment;
    "PoolRewardsUpdated(address,uint256)": EventFragment;
    "UnderwriterFeesClaimed(address,uint256)": EventFragment;
    "UnderwriterRewardsStaked(address,uint256)": EventFragment;
    "UnderwriterRewardsUpdated(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FeesCollected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorFeesClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorRewardsUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolRewardsUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnderwriterFeesClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnderwriterRewardsStaked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnderwriterRewardsUpdated"): EventFragment;
}

export type FeesCollectedEvent = TypedEvent<
  [string, string, BigNumber] & {
    network: string;
    member: string;
    totalFee: BigNumber;
  }
>;

export type OperatorFeesClaimedEvent = TypedEvent<
  [string, BigNumber] & { operator: string; totalRewards: BigNumber }
>;

export type OperatorRewardsUpdatedEvent = TypedEvent<
  [BigNumber] & { totalRewards: BigNumber }
>;

export type PoolRewardsUpdatedEvent = TypedEvent<
  [string, BigNumber] & { underwriter: string; totalRewards: BigNumber }
>;

export type UnderwriterFeesClaimedEvent = TypedEvent<
  [string, BigNumber] & { underwriter: string; totalRewards: BigNumber }
>;

export type UnderwriterRewardsStakedEvent = TypedEvent<
  [string, BigNumber] & { underwriter: string; totalStaked: BigNumber }
>;

export type UnderwriterRewardsUpdatedEvent = TypedEvent<
  [string, BigNumber] & { underwriter: string; totalRewards: BigNumber }
>;

export class ICreditFeeManager extends BaseContract {
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

  interface: ICreditFeeManagerInterface;

  functions: {
    calculatePercentInCollateral(
      _networkToken: string,
      _percent: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collectFees(
      _network: string,
      _networkMember: string,
      _transactionValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCollateralToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  calculatePercentInCollateral(
    _networkToken: string,
    _percent: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collectFees(
    _network: string,
    _networkMember: string,
    _transactionValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCollateralToken(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    calculatePercentInCollateral(
      _networkToken: string,
      _percent: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collectFees(
      _network: string,
      _networkMember: string,
      _transactionValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getCollateralToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "FeesCollected(address,address,uint256)"(
      network?: null,
      member?: null,
      totalFee?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { network: string; member: string; totalFee: BigNumber }
    >;

    FeesCollected(
      network?: null,
      member?: null,
      totalFee?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { network: string; member: string; totalFee: BigNumber }
    >;

    "OperatorFeesClaimed(address,uint256)"(
      operator?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { operator: string; totalRewards: BigNumber }
    >;

    OperatorFeesClaimed(
      operator?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { operator: string; totalRewards: BigNumber }
    >;

    "OperatorRewardsUpdated(uint256)"(
      totalRewards?: null
    ): TypedEventFilter<[BigNumber], { totalRewards: BigNumber }>;

    OperatorRewardsUpdated(
      totalRewards?: null
    ): TypedEventFilter<[BigNumber], { totalRewards: BigNumber }>;

    "PoolRewardsUpdated(address,uint256)"(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;

    PoolRewardsUpdated(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;

    "UnderwriterFeesClaimed(address,uint256)"(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;

    UnderwriterFeesClaimed(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;

    "UnderwriterRewardsStaked(address,uint256)"(
      underwriter?: null,
      totalStaked?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalStaked: BigNumber }
    >;

    UnderwriterRewardsStaked(
      underwriter?: null,
      totalStaked?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalStaked: BigNumber }
    >;

    "UnderwriterRewardsUpdated(address,uint256)"(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;

    UnderwriterRewardsUpdated(
      underwriter?: null,
      totalRewards?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { underwriter: string; totalRewards: BigNumber }
    >;
  };

  estimateGas: {
    calculatePercentInCollateral(
      _networkToken: string,
      _percent: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collectFees(
      _network: string,
      _networkMember: string,
      _transactionValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCollateralToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calculatePercentInCollateral(
      _networkToken: string,
      _percent: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collectFees(
      _network: string,
      _networkMember: string,
      _transactionValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCollateralToken(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
