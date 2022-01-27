// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkToken {
  function getNetworkRoles() external view returns (address);
}