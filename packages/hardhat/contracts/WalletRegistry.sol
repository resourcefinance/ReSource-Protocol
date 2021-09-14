// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./MultiSigWalletWithRelay.sol";

/// @title MultiSigWalletRegistry - Allows owner to added and remove multiSigWallet contracts from the registry.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract WalletRegistry is OwnableUpgradeable  {
    /*
     *  Events
     */
    event WalletAddition(address[] indexed wallet);
    event WalletCreation(address wallet);
    event WalletRemoval(address indexed wallet);

    /*
     *  Storage
     */
    mapping(address => bool) public isRegistered;
    address[] public wallets;
    address public operator;


    /*
     *  Modifiers
     */
    modifier walletDoesNotExist(address wallet) {
        require(!isRegistered[wallet], "wallet already exists");
        _;
    }

    modifier walletExists(address wallet) {
        require(isRegistered[wallet], "wallet does not exist");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner() || msg.sender == operator, "Unauthorized caller");
        _;
    }

    /*
     * External functions
     */

    function initialize(address[] memory _wallets, address operatorAddress) external virtual initializer {
        __Ownable_init();
        for (uint256 i = 0; i < _wallets.length; i++) {
            require(!isRegistered[_wallets[i]] && _wallets[i] != address(0));
            isRegistered[_wallets[i]] = true;
        }
        wallets = _wallets;
        operator = operatorAddress;
    }

    function createWallet(address[] memory _owners, uint256 _required) public onlyAuthorized() {
        MultiSigWallet multiSig = new MultiSigWallet();
        multiSig.initialize(_owners, _required);
        multiSig.transferOwnership(msg.sender);
        isRegistered[address(multiSig)] = true;
        wallets.push(address(multiSig));
        emit WalletCreation(address(multiSig));
    }

    function registerWallets(address[] memory _wallets) external onlyAuthorized() {
        for (uint256 i = 0; i < _wallets.length; i++) {
            require(!isRegistered[_wallets[i]] && _wallets[i] != address(0));
            isRegistered[_wallets[i]] = true;
            wallets.push(_wallets[i]);
        }
        emit WalletAddition(_wallets);
    }

    function removeWallet(address wallet) external onlyAuthorized() walletExists(wallet) {
        isRegistered[wallet] = false;
        for (uint256 i = 0; i < wallets.length - 1; i++)
            if (wallets[i] == wallet) {
                wallets[i] = wallets[wallets.length - 1];
                break;
            }
        wallets.pop();
        emit WalletRemoval(wallet);
    }
}
