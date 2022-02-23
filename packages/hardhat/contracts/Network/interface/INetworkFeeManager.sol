// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkFeeManager {
    event FeesCollected(address member, uint256 totalFee);

    event AmbassadorFeesClaimed(address ambassador, uint256 totalRewards);

    event NetworkFeesClaimed(address operator, uint256 totalRewards);

    event NetworkRewardsUpdated(uint256 totalRewards);

    event AmbassadorRewardsUpdated(address ambassador, uint256 totalRewards);

    function collectFees(
        address _network,
        address _member,
        uint256 _transactionValue
    ) external;

    function claimAmbassadorFees(address[] memory _members) external;

    function claimNetworkFees(address[] memory _members) external;
}
