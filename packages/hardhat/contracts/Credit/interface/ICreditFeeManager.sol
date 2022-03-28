// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditFeeManager {
    event FeesCollected(address network, address member, uint256 totalFee);

    event PoolRewardsUpdated(address underwriter, uint256 totalRewards);

    event UnderwriterRewardsStaked(address underwriter, uint256 totalStaked);

    function collectFees(
        address _network,
        address _networkMember,
        uint256 _transactionValue
    ) external;

    function getCollateralToken() external returns (address);

    function calculateFees(address _network, uint256 _transactionAmount)
        external
        view
        returns (uint256 creditFee);
}
