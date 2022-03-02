// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkFeeManager {
    event FeesCollected(address member, uint256 totalFee);

    event RewardsClaimed(address claimer, uint256 totalRewards);

    event NetworkRewardsUpdated(uint256 totalRewards);

    event AmbassadorRewardsUpdated(address ambassador, uint256 totalRewards);

    function collectFees(address _member, uint256 _transactionValue) external;

    function setNetwork(address _network) external;
}
