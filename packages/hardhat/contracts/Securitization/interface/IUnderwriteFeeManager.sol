// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnderwriteFeeManager {
    /// @notice This function is for collecting fees from network transactions.
    /// @dev This function is called on CIP36 transfer. If the tranfser uses credit assigned
    /// by the CreditManager contract, it will calculate and collect fees from the caller
    /// @param _network the address of the CIP36 token to collect fees from
    /// @param _networkMember the address of the network member to collect fees from
    /// @param _transactionValue the total amount used to collect fees from
    function collectFees(
        address _network,
        address _networkMember,
        uint256 _transactionValue
    ) external;

    /// @notice This function is for role addresses to claim their portion of accrued fees from
    /// a network member.
    /// @dev This function is called by assigned role addresses. It will move all accrued fees
    /// to 'rewards' associated with each role address.
    /// @param _network the address of the CIP36 token to claim fees from
    function claimFees(address _network) external;

    function getCollateralToken() external returns (address);

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) external returns (uint256);
}
