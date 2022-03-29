// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interface/ICreditRoles.sol";

contract CreditRoles is AccessControlUpgradeable, OwnableUpgradeable, ICreditRoles {
    /* ========== INITIALIZER ========== */

    function initialize(address[] memory _operators) external initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole("OPERATOR", msg.sender);
        _setupRole("UNDERWRITER", msg.sender);
        _setupRole("NETWORK", msg.sender);
        _setupRole("REQUEST", msg.sender);
        _setRoleAdmin("UNDERWRITER", "OPERATOR");
        _setRoleAdmin("NETWORK", "OPERATOR");
        _setRoleAdmin("REQUEST", "OPERATOR");
        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0));
            grantRole("OPERATOR", _operators[j]);
        }
        emit UnderwriterAdded(msg.sender);
    }

    /* ========== PUBLIC FUNCTIONS ========== */

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

    function grantUnderwriter(address _underwriter)
        external
        override
        onlyRole("OPERATOR")
        underwriterDoesNotExist(_underwriter)
    {
        grantRole("UNDERWRITER", _underwriter);
        emit UnderwriterAdded(_underwriter);
    }

    function revokeUnderwriter(address _underwriter)
        external
        override
        onlyRole("OPERATOR")
        underwriterExists(_underwriter)
    {
        revokeRole("UNDERWRITER", _underwriter);
        emit UnderwriterRemoved(_underwriter);
    }

    function grantNetwork(address _network) external override onlyRole("OPERATOR") {
        require(!hasRole("NETWORK", _network) && _network != address(0), "invalid network");
        grantRole("NETWORK", _network);
    }

    function revokeNetwork(address _network)
        external
        override
        onlyRole("OPERATOR")
        networkExists(_network)
    {
        revokeRole("NETWORK", _network);
    }

    function grantRequestOperator(address _requestOperator) external override onlyRole("OPERATOR") {
        require(
            !hasRole("REQUEST", _requestOperator) && _requestOperator != address(0),
            "invalid request"
        );
        grantRole("REQUEST", _requestOperator);
    }

    function revokeRequestOperator(address _requestOperator)
        external
        override
        onlyRole("OPERATOR")
        requestOperatorExists(_requestOperator)
    {
        revokeRole("REQUEST", _requestOperator);
    }

    /* ========== VIEWS ========== */

    function isUnderwriter(address _underwriter) external view override returns (bool) {
        return hasRole("UNDERWRITER", _underwriter) || hasRole("OPERATOR", _underwriter);
    }

    function isCreditOperator(address _operator) external view override returns (bool) {
        return hasRole("OPERATOR", _operator);
    }

    function isNetwork(address _network) external view override returns (bool) {
        return hasRole("NETWORK", _network) || hasRole("OPERATOR", _network);
    }

    function isRequestOperator(address _operator) external view override returns (bool) {
        return hasRole("REQUEST", _operator) || hasRole("OPERATOR", _operator);
    }

    /* ========== MODIFIERS ========== */

    modifier underwriterExists(address _underwriter) {
        require(hasRole("UNDERWRITER", _underwriter), "NetworkRoles: underwriter does not exist");
        _;
    }

    modifier underwriterDoesNotExist(address _underwriter) {
        require(!hasRole("UNDERWRITER", _underwriter), "NetworkRoles: underwriter already exists");
        _;
    }

    modifier networkExists(address _network) {
        require(hasRole("NETWORK", _network), "NetworkRoles: network does not exist");
        _;
    }

    modifier requestOperatorExists(address _requestOperator) {
        require(
            hasRole("REQUEST", _requestOperator),
            "NetworkRoles: request operator does not exist"
        );
        _;
    }

    modifier operatorDoesNotExist(address _operator) {
        require(!hasRole("OPERATOR", _operator), "CreditRoles: operator already exists");
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
