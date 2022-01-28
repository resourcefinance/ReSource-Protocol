// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "../Securitization/interface/IProtocolRoles.sol";
import "./interface/INetworkRoles.sol";

/// @title NetworkRegistry - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkRoles is AccessControlUpgradeable, OwnableUpgradeable, INetworkRoles {
    /*
     *  Storage
     */
    IiKeyWalletDeployer private walletDeployer;
    // member => ambassador
    mapping(address => address) memberAmbassador;
    // member => ambassador => invited
    mapping(address => mapping(address => bool)) memberAmbassadorInvites;

    mapping(address => uint256) creditAllowance;

    /*
     *  Modifiers
     */
    modifier memberDoesNotExist(address _member) {
        require(!hasRole("MEMBER", _member), "NetworkRoles: member already exists");
        _;
    }

    modifier memberExists(address _member) {
        require(hasRole("MEMBER", _member), "NetworkRoles: member does not exist");
        _;
    }

    modifier onlyMember() {
        require(hasRole("MEMBER", msg.sender), "NetworkRoles: member does not exist");
        _;
    }

    modifier ambassadorDoesNotExist(address _ambassador) {
        require(!hasRole("AMBASSADOR", _ambassador), "NetworkRoles: ambassador already exists");
        _;
    }

    modifier ambassadorExists(address _ambassador) {
        require(hasRole("AMBASSADOR", _ambassador), "NetworkRoles: ambassador does not exist");
        _;
    }

    modifier onlyAmbassador() {
        require(
            hasRole("AMBASSADOR", msg.sender) || hasRole("OPERATOR", msg.sender),
            "NetworkRoles: Only ambassadors can call"
        );
        _;
    }

    modifier operatorDoesNotExist(address _operator) {
        require(!hasRole("OPERATOR", _operator), "NetworkRoles: operator already exists");
        _;
    }

    modifier operatorExists(address _operator) {
        require(hasRole("OPERATOR", _operator), "NetworkRoles: operator does not exist");
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

    /*
     * External functions
     */
    /// @dev Contract initialzer sets initial operators.
    /// @param _operators List of initial operators.
    function initialize(address[] memory _operators, address _walletDeployer) external initializer {
        __AccessControl_init();
        walletDeployer = IiKeyWalletDeployer(_walletDeployer);
        // create roles
        _setupRole("OPERATOR", msg.sender);
        _setupRole("AMBASSADOR", msg.sender);
        _setupRole("MEMBER", msg.sender);
        // configure roles hierarchy
        _setRoleAdmin("AMBASSADOR", "OPERATOR");
        _setRoleAdmin("MEMBER", "AMBASSADOR");

        for (uint256 j = 0; j < _operators.length; j++) {
            require(_operators[j] != address(0));
            grantRole("OPERATOR", _operators[j]);
        }
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function inviteMember(address _member) external onlyAmbassador {
        require(
            !memberAmbassadorInvites[_member][msg.sender],
            "NetworkRoles: Invite already exists"
        );
        memberAmbassadorInvites[_member][msg.sender] = true;
    }

    function acceptAmbassadorInvitation(address _ambassador) external {
        require(
            memberAmbassadorInvites[msg.sender][_ambassador],
            "NetworkRoles: Invite does not exist"
        );
        memberAmbassador[msg.sender] = _ambassador;
        delete memberAmbassadorInvites[msg.sender][_ambassador];
        grantRole("MEMBER", msg.sender);
    }

    /// @dev Allows operator to add a new member. Transaction has to be sent by an operator wallet.
    /// @param _ambassador Addresses of new ambassador.
    function grantAmbassador(address _ambassador, uint256 _creditAllowance)
        external
        onlyNetworkOperator
        ambassadorDoesNotExist(_ambassador)
        notNull(_ambassador)
    {
        grantRole("AMBASSADOR", _ambassador);
        creditAllowance[_ambassador] = _creditAllowance;
    }

    function updateAmbassador(address _ambassador, uint256 _creditAllowance)
        external
        onlyNetworkOperator
        ambassadorExists(_ambassador)
    {
        creditAllowance[_ambassador] = _creditAllowance;
    }

    /// @dev Allows to remove a member. Transaction has to be sent by operator.
    /// @param _ambassador Address of ambassador.
    function revokeAmbassador(address _ambassador)
        external
        onlyNetworkOperator
        ambassadorExists(_ambassador)
        notNull(_ambassador)
    {
        revokeRole("AMBASSADOR", _ambassador);
    }

    function transferAmbassadorMember(address _member, address _ambassador)
        external
        memberExists(_member)
    {
        require(
            _ambassador != msg.sender,
            "NetworkRoles: Cannot transfer membership to caller address"
        );
        require(isAmbassador(_ambassador), "NetworkRoles: provided ambassador does not have role");
        if (!isNetworkOperator(msg.sender)) {
            require(
                memberAmbassador[_member] == msg.sender,
                "NetworkRoles: Membership is not owned by caller"
            );
        }
        memberAmbassador[_member] = _ambassador;
    }

    /// @dev Allows to add a new operator. Transaction has to be sent by an operator wallet.
    /// @param _operator Address of new operator.
    function grantOperator(address _operator)
        external
        operatorDoesNotExist(_operator)
        notNull(_operator)
        onlyAdmin
    {
        grantRole("OPERATOR", _operator);
    }

    /// @dev Allows to remove a operator. Transaction has to be sent by operator.
    /// @param _operator Address of operator.
    function removeOperator(address _operator) external onlyAdmin {
        require(_operator != owner(), "can't remove owner operator");
        revokeRole("OPERATOR", _operator);
    }

    function isMember(address _member) external view override returns (bool) {
        return hasRole("MEMBER", _member);
    }

    function getMemberAmbassador(address _member) external view override returns (address) {
        return memberAmbassador[_member];
    }

    function isAmbassador(address _ambassador) public view override returns (bool) {
        return hasRole("AMBASSADOR", _ambassador);
    }

    function isNetworkOperator(address _operator) public view override returns (bool) {
        return hasRole("OPERATOR", _operator);
    }

    /// @dev Deploys a multisigwallet and adds it to members
    /// @param _clients client wallets of the multisig
    /// @param _guardians guardian wallets of the multisig
    /// @param _coSigner coSigner wallet of the multiSig
    /// @param _network address of the CIP36 network token
    /// @param _ambassador address of the ambassador
    /// @param _required required signatures of the multiSig
    function deployMemberWallet(
        address[] memory _clients,
        address[] memory _guardians,
        address _coSigner,
        address _network,
        address _ambassador,
        uint256 _required
    ) public onlyAmbassador {
        address newWallet = walletDeployer.deployWallet(_clients, _guardians, _coSigner, _required);
        OwnableUpgradeable(newWallet).transferOwnership(owner());
        memberAmbassador[newWallet] = _ambassador;
        ICIP36(_network).setCreditLimit(newWallet, creditAllowance[_ambassador]);
        grantRole("MEMBER", newWallet);
    }
}
