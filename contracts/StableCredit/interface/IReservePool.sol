// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReservePool {
    function totalCollateral() external view returns (uint256);

    function stake(uint256 amount) external;
}
