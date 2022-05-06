// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "./interface/INetworkRoles.sol";
import "./interface/ICIP36.sol";

contract NetworkRoles is AccessControlUpgradeable, OwnableUpgradeable, INetworkRoles {
    /* ========== STATE VARIABLES ========== */

    IiKeyWalletDeployer private walletDeployer;
    address network;

    /* ========== INITIALIZER ========== */

    function initialize(address[] memory _operators, address _walletDeployer) external initializer {
        __AccessControl_init();
        walletDeployer = IiKeyWalletDeployer(_walletDeployer);
        // create roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole("OPERATOR", msg.sender);
        _setupRole("MEMBER", msg.sender);
        _setRoleAdmin("MEMBER", "OPERATOR");

        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0), "NetworkRoles: invalid operator supplied");
            grantRole("OPERATOR", _operators[j]);
        }
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function grantMember(address _member) external override onlyNetworkOperator {
        grantRole("MEMBER", _member);
        emit MemberAdded(_member);
    }

    function grantOperator(address _operator)
        external
        operatorDoesNotExist(_operator)
        notNull(_operator)
        onlyAdmin
    {
        grantRole("OPERATOR", _operator);
    }

    function revokeOperator(address _operator) external onlyAdmin {
        require(_operator != owner(), "can't remove owner operator");
        revokeRole("OPERATOR", _operator);
    }

    function setNetwork(address _network) external onlyNetworkOperator {
        network = _network;
    }

    /* ========== VIEWS ========== */

    function isMember(address _member) external view override returns (bool) {
        return hasRole("MEMBER", _member);
    }

    function isNetworkOperator(address _operator) public view override returns (bool) {
        return hasRole("OPERATOR", _operator);
    }

    /* ========== MODIFIERS ========== */

    modifier memberExists(address _member) {
        require(hasRole("MEMBER", _member), "NetworkRoles: member does not exist");
        _;
    }

    modifier operatorDoesNotExist(address _operator) {
        require(!hasRole("OPERATOR", _operator), "NetworkRoles: operator already exists");
        _;
    }

    modifier onlyNetworkOperator() {
        require(hasRole("OPERATOR", msg.sender), "NetworkRoles: operator does not exist");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NetworkRoles: Only admin can call");
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0), "invalid operator address");
        _;
    }
}
