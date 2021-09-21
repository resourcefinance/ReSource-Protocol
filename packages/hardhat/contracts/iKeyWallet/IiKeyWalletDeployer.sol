// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IiKeyWalletDeployer {
    function deployWallet(
        address[] memory _clients, 
        address[] memory _guardians, 
        address _coSigner, 
        uint256 _required) external returns (address);
}
