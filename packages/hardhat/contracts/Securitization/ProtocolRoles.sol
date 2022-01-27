// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interface/IProtocolRoles.sol";


/// @title This contract 
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract ProtocolRoles is AccessControlUpgradeable, OwnableUpgradeable, IProtocolRoles {
    /*
     *  Modifiers
     */

    modifier underwriterExists(address _underwriter) {
        require(hasRole("UNDERWRITER", _underwriter), "NetworkRoles: underwriter does not exist");
        _;
    }

    modifier underwriterDoesNotExist(address _underwriter) {
        require(!hasRole("UNDERWRITER", _underwriter), "NetworkRoles: underwriter already exists");
        _;
    }

    modifier networkExists(address _network) {
        require(hasRole("NETWORK", _network),"NetworkRoles: network does not exist" );
        _;
    }

    /*
     * External functions
     */
    /// @dev Contract initialzer sets initial operators.
    /// @param _operators List of initial operators.
    function initialize(address[] memory _operators, address _network) external initializer {
        __AccessControl_init();
        // create roles
        _setupRole("OPERATOR", msg.sender);
        _setupRole("UNDERWRITER", msg.sender);
        _setupRole("NETWORK", _network);
        // configure roles hierarchy
        _setRoleAdmin("UNDERWRITER", "OPERATOR");
        _setRoleAdmin("NETWORK", "OPERATOR");

        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0));
            grantRole("OPERATOR", _operators[j]);
        }
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantUnderwriter(address _underwriter) external override onlyRole("OPERATOR") underwriterDoesNotExist(_underwriter) {
        grantRole("UNDERWRITER", _underwriter);
    }

    /// @dev Allows to revoke underwriter roll from given address. Transaction must to be sent by operator.
    /// @param _underwriter Address of underwriter to be removed.
    function revokeUnderwriter(address _underwriter) external override onlyRole("OPERATOR") underwriterExists(_underwriter) {
        revokeRole("UNDERWRITER", _underwriter);
    }

    function grantNetwork(address _network) external override onlyRole("OPERATOR") {
        require(!hasRole("NETWORK", _network) && _network != address(0), "invalid network");
        grantRole("NETWORK", _network);
    }

    function revokeNetwork(address _network) external override onlyRole("OPERATOR") networkExists(_network) {
        revokeRole("NETWORK", _network);
    }

    function isUnderwriter(address _underwriter) external view override returns(bool) {
        return hasRole("UNDERWRITER", _underwriter) || hasRole("OPERATOR", _underwriter);
    }
    
    function isProtocolOperator(address _operator) external view override returns(bool) {
        return hasRole("OPERATOR", _operator);
    }

    function isNetwork(address _network) external view override returns(bool) {
        return hasRole("NETWORK", _network) || hasRole("OPERATOR", _network);
    }
}
