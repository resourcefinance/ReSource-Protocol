// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "./interface/INetworkRegistry.sol";

/// @title NetworkRegistry - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkRegistryV3 is AccessControlUpgradeable, OwnableUpgradeable, INetworkRegistry {
    address walletDeployer;

    event WalletDeployed(address newMember);

    /*
     *  Modifiers
     */
    modifier memberExists(address member) {
        hasRole("MEMBER", member);
        _;
    }

    modifier ambassadorExists(address ambassador) {
        hasRole("AMBASSADOR", ambassador);
        _;
    }

    /*
     * External functions
     */
    /// @dev Contract initialzer sets initial members and initial operators.
    /// @param _members List of initial members.
    /// @param _operators List of initial operators.
    function initialize(address[] memory _members, address[] memory _operators, address _walletDeployer) external initializer {
        __AccessControl_init();
        // create roles
        _setupRole("DEFAULT_ADMIN_ROLE", msg.sender);
        _setupRole("OPERATOR", msg.sender);
        _setupRole("AMBASSADOR", msg.sender);
        _setupRole("MEMBER", msg.sender);
        // configure roles hierarchy
        _setRoleAdmin("OPERATOR", "DEFAULT_ADMIN_ROLE");
        _setRoleAdmin("AMBASSADOR", "OPERATOR");
        _setRoleAdmin("MEMBER", "AMBASSADOR");


        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0));
            grantRole("OPERATOR", _operators[j]);
        }
        for (uint256 i = 0; i < _members.length; i++) {
            require(_members[i] != address(0));
            grantRole("MEMBER", _members[i]);
        }
        walletDeployer = _walletDeployer;
    }

    function grantMemberships(address[] memory _members) external override onlyRole("AMBASSADOR") {
        for (uint256 i = 0; i < _members.length; i++) {
            require(!hasRole("AMBASSADOR", _members[i]) && _members[i] != address(0), "invalid members");
            grantRole("MEMBER", _members[i]);
        }
    }

    /// @dev Allows to revoke membership from a given address. Transaction must to be sent by operator.
    /// @param member Address of member to be removed.
    function revokeMembership(address member) external override onlyRole("AMBASSADOR") memberExists(member)  {
        revokeRole("MEMBER", member);
    }

    /// @dev Allows to revoke ambassador roll from given address. Transaction must to be sent by operator.
    /// @param ambassador Address of ambassador to be removed.
    function revokeAmbassadorship(address ambassador) external override onlyRole("OPERATOR") ambassadorExists(ambassador) {
        revokeRole("AMBASSADOR", ambassador);
    }

    function grantAmbassadorships(address[] memory _ambassadors) external override onlyRole("OPERATOR") {
        for (uint256 i = 0; i < _ambassadors.length; i++) {
            require(!hasRole("AMBASSADOR", _ambassadors[i]) && _ambassadors[i] != address(0), "invalid members");
            grantRole("MEMBER", _ambassadors[i]);
            grantRole("AMBASSADOR", _ambassadors[i]);
        }
    }

    function isMember(address _member) external view override returns(bool) {
        return hasRole("MEMBER", _member);
    }
    
    function isAmbassador(address _ambassador) external view override returns(bool) {
        return hasRole("AMBASSADOR", _ambassador);
    }
    
    function isOperator(address _operator) external view override returns(bool) {
        return hasRole("OPERATOR", _operator);
    }

    /// @dev Deploys a multisigwallet and adds it to members
    /// @param clients client wallets of the multisig
    /// @param guardians guardian wallets of the multisig
    /// @param coSigner coSigner wallet of the multiSig
    /// @param required required signatures of the multiSig 
    function deployWalletToRegistry(
        address[] memory clients,
        address[] memory guardians, 
        address coSigner,
        uint256 required) public override onlyRole("OPERATOR") {
        // deploy new wallet
        address newWallet = IiKeyWalletDeployer(walletDeployer).deployWallet(clients, guardians, coSigner, required);
        // transfer ownership to registry owner
        OwnableUpgradeable(newWallet).transferOwnership(owner());
        // add new wallet to registry
        grantRole("MEMBER", newWallet);
        emit WalletDeployed(newWallet);
    }
}
