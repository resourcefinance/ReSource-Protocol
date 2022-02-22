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

interface ICreditRolesInterface extends ethers.utils.Interface {
  functions: {
    "grantNetwork(address)": FunctionFragment;
    "grantRequestOperator(address)": FunctionFragment;
    "grantUnderwriter(address)": FunctionFragment;
    "isCreditOperator(address)": FunctionFragment;
    "isNetwork(address)": FunctionFragment;
    "isRequestOperator(address)": FunctionFragment;
    "isUnderwriter(address)": FunctionFragment;
    "revokeNetwork(address)": FunctionFragment;
    "revokeRequestOperator(address)": FunctionFragment;
    "revokeUnderwriter(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "grantNetwork",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRequestOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "grantUnderwriter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isCreditOperator",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "isNetwork", values: [string]): string;
  encodeFunctionData(
    functionFragment: "isRequestOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isUnderwriter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeNetwork",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRequestOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeUnderwriter",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "grantNetwork",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantRequestOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantUnderwriter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isCreditOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isNetwork", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRequestOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isUnderwriter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeNetwork",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeRequestOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeUnderwriter",
    data: BytesLike
  ): Result;

  events: {};
}

export class ICreditRoles extends BaseContract {
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

  interface: ICreditRolesInterface;

  functions: {
    grantNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    grantRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    grantUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isCreditOperator(
      _operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isNetwork(_network: string, overrides?: CallOverrides): Promise<[boolean]>;

    isRequestOperator(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    revokeNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  grantNetwork(
    _network: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  grantRequestOperator(
    _requestOperator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  grantUnderwriter(
    _underwriter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isCreditOperator(
    _operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isNetwork(_network: string, overrides?: CallOverrides): Promise<boolean>;

  isRequestOperator(
    _operator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isUnderwriter(
    _underwriter: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  revokeNetwork(
    _network: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRequestOperator(
    _requestOperator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeUnderwriter(
    _underwriter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    grantNetwork(_network: string, overrides?: CallOverrides): Promise<void>;

    grantRequestOperator(
      _requestOperator: string,
      overrides?: CallOverrides
    ): Promise<void>;

    grantUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isCreditOperator(
      _operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isNetwork(_network: string, overrides?: CallOverrides): Promise<boolean>;

    isRequestOperator(
      _operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    revokeNetwork(_network: string, overrides?: CallOverrides): Promise<void>;

    revokeRequestOperator(
      _requestOperator: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    grantNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    grantRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    grantUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isCreditOperator(
      _operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isNetwork(_network: string, overrides?: CallOverrides): Promise<BigNumber>;

    isRequestOperator(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    revokeNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    grantNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    grantRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    grantUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isCreditOperator(
      _operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isNetwork(
      _network: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isRequestOperator(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isUnderwriter(
      _underwriter: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    revokeNetwork(
      _network: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRequestOperator(
      _requestOperator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeUnderwriter(
      _underwriter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
