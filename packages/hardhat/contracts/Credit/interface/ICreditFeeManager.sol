// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditFeeManager {
    event FeesCollected(address network, address member, uint256 totalFee);

    event UnderwriterFeesClaimed(address underwriter, uint256 totalRewards);

    event OperatorFeesClaimed(address operator, uint256 totalRewards);

    event OperatorRewardsUpdated(uint256 totalRewards);

    event PoolRewardsUpdated(address underwriter, uint256 totalRewards);

    event UnderwriterRewardsStaked(address underwriter, uint256 totalStaked);

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
