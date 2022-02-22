// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditFeeManager {
    function collectFees(
        address _network,
        address _networkMember,
        uint256 _transactionValue
    ) external;

    function getCollateralToken() external returns (address);

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) external returns (uint256);
}
