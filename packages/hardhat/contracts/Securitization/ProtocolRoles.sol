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

    modifier ambassadorExists(address ambassador) {
        hasRole("AMBASSADOR", ambassador);
        _;
    }

    modifier underwriterExists(address _underwriter) {
        hasRole("UNDERWRITER", _underwriter);
        _;
    }

    modifier networkExists(address _network) {
        hasRole("NETWORK", _network);
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
        _setupRole("DEFAULT_ADMIN_ROLE", msg.sender);
        _setupRole("OPERATOR", msg.sender);
        _setupRole("AMBASSADOR", msg.sender);
        _setupRole("UNDERWRITER", msg.sender);
        _setupRole("NETWORK", _network);
        // configure roles hierarchy
        _setRoleAdmin("OPERATOR", "DEFAULT_ADMIN_ROLE");
        _setRoleAdmin("UNDERWRITER", "OPERATOR");
        _setRoleAdmin("NETWORK", "OPERATOR");
        _setRoleAdmin("AMBASSADOR", "NETWORK");


        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0));
            grantRole("OPERATOR", _operators[j]);
        }
    }


    /// @dev Allows to revoke ambassador roll from given address. Transaction must to be sent by operator.
    /// @param _ambassador Address of ambassador to be removed.
    function revokeAmbassador(address _ambassador) external override onlyRole("OPERATOR") ambassadorExists(_ambassador) {
        revokeRole("AMBASSADOR", _ambassador);
    }

    function grantAmbassador(address _ambassador) external override onlyRole("OPERATOR") {
        require(!hasRole("AMBASSADOR", _ambassador) && _ambassador != address(0), "invalid ambassador");
        grantRole("AMBASSADOR", _ambassador);
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

    function grantUnderwriter(address _ambassador) external override onlyRole("OPERATOR") {
        require(!hasRole("AMBASSADOR", _ambassador) && _ambassador != address(0), "invalid operator");
        grantRole("AMBASSADOR", _ambassador);
    }
    
    function isAmbassador(address _ambassador) external view override returns(bool) {
        return hasRole("AMBASSADOR", _ambassador) || hasRole("OPERATOR", _ambassador);
    }

    function isUnderwriter(address _underwriter) external view override returns(bool) {
        return hasRole("UNDERWRITER", _underwriter) || hasRole("OPERATOR", _underwriter);
    }
    
    function isOperator(address _operator) external view override returns(bool) {
        return hasRole("OPERATOR", _operator);
    }

    function isNetwork(address _network) external view override returns(bool) {
        return hasRole("NETWORK", _network) || hasRole("OPERATOR", _network);
    }
}
