pragma solidity ^0.8.0;

interface IUnderwriteManager {
    function underwriteCreditLine(address networkToken, uint256 collateralAmount, address counterparty) external;

    function extendCreditLine(address counterparty, uint256 collateralAmount) external;

    function withdrawCreditLine(address counterparty) external;

    function renewCreditLine(address counterparty) external;

    function tryUpdateReward(address counterparty, uint256 txAmount) external;

    function claimRewards(address[] memory counterparties) external;

    function activate() external;

    function deactivate() external;

    function updateUnderwriters(address[] memory _underwriters, bool[] memory isUnderwriter) external;

    function addNetwork(address networkAddress) external;

    function removeNetwork(address networkAddress) external;
}
