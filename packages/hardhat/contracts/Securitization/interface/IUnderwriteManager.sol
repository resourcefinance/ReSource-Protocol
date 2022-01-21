// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnderwriteManager {
    struct CreditLine {
        address underwriter;
        address network;
        uint256 collateral;
        uint256 issueDate;
    }
    
    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param _counterparty The address of the credit line counterparty
    /// @param _underwriter The address of the underwriter underwriting the line of credit
    /// @param _collateral The amount of collateral provided to a credit line 
    /// @param _creditLimit The total credit limit of the new credit line
    /// @param _network The address of the network token
    function createCreditLine(
        address _counterparty,
        address _underwriter,
        uint256 _collateral,
        uint256 _creditLimit,
        address _network) external;

    function getCollateralToken() external returns(address);
    
    function getMinLTV() external returns(uint256);

    function getCreditLine(address getCreditLine, address _counterparty) external returns(CreditLine memory);

    function calculateLTV(address _network, address _counterparty) external returns(uint256);
    
    function isValidLTV(address _network, address _counterparty) external returns(bool);

    function isCreditLineExpired(address _network, address _counterparty) external returns(bool);

    function depositAndStakeCollateral(address _network, address _counterparty, address _underwriter, uint256 _amount) external;

    function swapCreditLine(address _network, address _counterparty, address _underwriter) external;

    function extendCreditLine(address _network, address _counterparty, address _underwriter, uint256 _collateral, uint256 _creditLimit) external;

    function convertNetworkToCollateral(address _network, uint256 _amount) external returns(uint256);

    function unstakeCollateral(address _network, address _counterparty, uint256 _amount) external;

    function renewCreditLine(address _network, address _counterparty) external;

    function getNeededCollateral(address _network, address _counterparty) external returns(uint256);
}
