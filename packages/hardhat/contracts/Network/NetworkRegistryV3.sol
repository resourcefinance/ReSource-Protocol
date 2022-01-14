// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "../Securitization/interface/IProtocolRoles.sol";
import "./interface/INetworkRegistry.sol";


/// @title NetworkRegistry - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkRegistryV3 is OwnableUpgradeable, INetworkRegistry  {
    /*
     *  Storage
     */
    IiKeyWalletDeployer private walletDeployer;
    IProtocolRoles public roles;
    mapping(address => address) membership;
    mapping(address => bool) isAmbassador;
    mapping(address => bool) isOperator;


    /*
     *  Modifiers
     */
    modifier onlyAmbassador() {
        require(isAmbassador[msg.sender], "Unauthorized caller");
        _;
    }

    modifier hasNetworkRole() {
        require(roles.isNetwork(msg.sender), "Unauthorized caller");
        _;
    }

    modifier onlyOperator(address _operator) {
        require(isOperator[_operator], "address is not operator");
        _;
    }

    modifier memberDoesNotExist(address _member) {
        require(membership[_member] == address(0), "member already exists");
        _;
    }

    modifier memberExists(address _member) {
        require(membership[_member] != address(0), "member does not exist");
        _;
    }

    modifier operatorDoesNotExist(address _operator) {
        require(!isOperator[_operator], "operator already exists");
        _;
    }


    modifier notNull(address _address) {
        require(_address != address(0), "invalid operator address");
        _;
    }
    
    function initialize(
        address _roles,
        address _walletDeployer
    ) external virtual initializer {
        roles = IProtocolRoles(_roles);
        walletDeployer = IiKeyWalletDeployer(_walletDeployer);
    }

    /// @dev Allows operator to add a new member. Transaction has to be sent by an operator wallet.
    /// @param _members Addresses of new members.
    // TODO: allow for ambassadors, and operators to call
    function addMembers(address[] memory _members) external {
        for (uint256 i = 0; i < _members.length; i++) {
            require(_members[i] != address(0), "NetworkRegistry: invalid member address");
            require(membership[_members[i]] != address(0), "NetworkRegistry: member already registered");
            membership[_members[i]] = msg.sender;
        }
    }

    /// @dev Allows to remove a member. Transaction has to be sent by operator.
    /// @param member Address of member.
    // TODO: allow for ambassadors, and operators to call
    function removeMember(address member) external {
        membership[member] = address(0);
    }

    /// @dev Allows operator to add a new member. Transaction has to be sent by an operator wallet.
    /// @param _ambassador Addresses of new ambassador.
    // TODO: allow for operators to call
    function addAmbassador(address _ambassador) external  {
        require(_ambassador != address(0), "NetworkRegistry: invalid ambassador address");
        require(!isAmbassador[_ambassador], "NetworkRegistry: ambassador already registered");
        roles.grantAmbassador(_ambassador);
        // grant ambassador role 
        isAmbassador[_ambassador] = true;
    }

    /// @dev Allows to remove a member. Transaction has to be sent by operator.
    /// @param _ambassador Address of ambassador.
    // TODO: allow for operators to call
    function removeAmbassador(address _ambassador) external onlyOperator(msg.sender) {
        isAmbassador[_ambassador] = false;
    }

    /// @dev Allows to add a new operator. Transaction has to be sent by an operator wallet.
    /// @param operator Address of new operator.
    // TODO: allow for operator to call
    function addOperator(address operator)
        external
        onlyOwner()
        operatorDoesNotExist(operator)
        notNull(operator)
    {
        isOperator[operator] = true;
    }

    /// @dev Allows to remove a operator. Transaction has to be sent by operator.
    /// @param operator Address of operator.
    // TODO: allow for owner to call
    function removeOperator(address operator) external onlyOwner() onlyOperator(operator) {
        require(operator != owner(), "can't remove owner operator");
        isOperator[operator] = false;
    }

    function isMember(address _member) external override view returns(bool) {
        return membership[_member] != address(0);
    }

    function isValidOperator(address _operator) external override view returns(bool) {
        return isOperator[_operator];
    }


    /// @dev Deploys a multisigwallet and adds it to members
    /// @param clients client wallets of the multisig
    /// @param guardians guardian wallets of the multisig
    /// @param coSigner coSigner wallet of the multiSig
    /// @param required required signatures of the multiSig 
    function deployAndAddWallet(
        address[] memory clients,
        address[] memory guardians, 
        address coSigner,
        uint256 required) public onlyAmbassador { 
        address newWallet = walletDeployer.deployWallet(clients, guardians, coSigner, required);
        OwnableUpgradeable(newWallet).transferOwnership(owner());
        membership[newWallet] = msg.sender;
    }
}
