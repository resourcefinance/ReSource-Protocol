// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnderwriteManager {
    struct CreditLine {
        address underwriter;
        address ambassador;
        address networkToken;
        uint256 collateral;
        uint256 issueDate;
    }
    
    function requestUnstake(address _counterparty) external;
    
    function createCreditLine(
        address _counterparty, 
        address _underwriter, 
        address _ambassador, 
        uint256 _collateral, 
        uint256 _creditLimit, 
        address _networkToken) external;

    function getCollateralToken() external returns(address);
    
    function getMinLTV() external returns(uint256);

    function getCreditLine(address _counterparty) external returns(CreditLine memory);

    function calculateLTV(address _counterparty) external returns(uint256);
    
    function isValidLTV(address _counterparty) external returns(bool);

    function depositCollateral(address _counterparty, uint256 _amount) external;

    function swapCreditLine(address _counterparty, address _underwriter) external;

    function extendCreditLine(address _counterparty, uint256 _collateral, uint256 _creditLimit) external;

    function convertNetworkToCollateral(address _networkToken, uint256 _amount) external returns(uint256);

}
