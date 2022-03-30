// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditPool {
    function notifyRewardAmount(address _rewardsToken, uint256 reward) external;

    function totalSupply() external view returns (uint256);

    function stakeFor(address _staker, uint256 _amount) external;

    function balanceOf(address _account) external view returns (uint256);

    function reduceTotalCredit(uint256 _amountToAdd) external;

    function increaseTotalCredit(uint256 _amountToRemove) external;

    function getUnderwriter() external view returns (address);

    function getTotalCredit() external view returns (uint256);
}
