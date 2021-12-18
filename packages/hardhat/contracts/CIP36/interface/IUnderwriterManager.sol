pragma solidity ^0.8.0;

interface IUnderwriterManager {
    struct CreditLine {
        address underwriter;
        uint256 collateral;
        address networkToken;
        uint256 issueDate;
    }

    function extendCreditLine(address counterparty, uint256 _tokens) external;

    function renewCreditLine(address counterparty) external;
    
    function claimUnderwriterRewards() external;

    function withdrawFromCreditLine(address counterparty) external;

    function pause() external;

    function unpause() external;

    function updateUnderwriters(address[] memory _underwriters, bool[] memory isUnderwriter) external;

    function addNetwork(address networkAddress) external;

    function removeNetwork(address networkAddress) external;
}
