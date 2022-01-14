// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkRegistry {
    function isMember(address _member) external view returns(bool);
    
    function isValidOperator(address _operator) external view returns(bool);
}
