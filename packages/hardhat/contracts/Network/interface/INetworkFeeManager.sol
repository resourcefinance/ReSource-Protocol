// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkFeeManager {
    function collectFees(
        address _network,
        address _member,
        uint256 _transactionValue
    ) external;

    function claimAmbassadorFees(address _member) external;

    function claimNetworkFees(address _member) external;
}
