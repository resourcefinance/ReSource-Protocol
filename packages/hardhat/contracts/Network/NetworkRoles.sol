// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "./interface/INetworkRoles.sol";
import "./interface/ICIP36.sol";
import "hardhat/console.sol";

contract NetworkRoles is AccessControlUpgradeable, OwnableUpgradeable, INetworkRoles {
    /* ========== STATE VARIABLES ========== */

    IiKeyWalletDeployer private walletDeployer;
    // member => ambassador
    mapping(address => address) membershipAmbassador;
    // member => ambassador => invited
    mapping(address => mapping(address => bool)) memberInvited;
    // ambassador => allowance
    mapping(address => uint256) ambassadorCreditAllowance;

    /* ========== INITIALIZER ========== */

    function initialize(address[] memory _operators, address _walletDeployer) external initializer {
        __AccessControl_init();
        walletDeployer = IiKeyWalletDeployer(_walletDeployer);
        // create roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function createMembershipAmbassadorInvite(address _member) external onlyAmbassador {
        require(!memberInvited[_member][msg.sender], "NetworkRoles: Invite already exists");
        memberInvited[_member][msg.sender] = true;
        grantRole("MEMBER", _member);
        emit MemberAdded(_member, address(0));
    }

    function acceptMembershipAmbassadorInvitation(address _network, address _ambassador) external {
        require(memberInvited[msg.sender][_ambassador], "NetworkRoles: Invite does not exist");
        membershipAmbassador[msg.sender] = _ambassador;
        delete memberInvited[msg.sender][_ambassador];
        ICIP36(_network).setCreditLimit(msg.sender, ambassadorCreditAllowance[_ambassador]);
        emit MembershipAmbassadorUpdated(msg.sender, _ambassador);
    }

    function grantAmbassador(address _ambassador, uint256 _ambassadorCreditAllowance)
        external
        onlyNetworkOperator
        ambassadorDoesNotExist(_ambassador)
        notNull(_ambassador)
    {
        grantRole("AMBASSADOR", _ambassador);
        ambassadorCreditAllowance[_ambassador] = _ambassadorCreditAllowance;
        emit AmbassadorAdded(_ambassador, _ambassadorCreditAllowance);
    }

    function updateAmbassadorCreditAllowance(
        address _ambassador,
        uint256 _ambassadorCreditAllowance
    ) external onlyNetworkOperator ambassadorExists(_ambassador) {
        ambassadorCreditAllowance[_ambassador] = _ambassadorCreditAllowance;
        emit AmbassadorAllowanceUpdated(_ambassador, _ambassadorCreditAllowance);
    }

    function revokeAmbassador(address _ambassador)
        external
        onlyNetworkOperator
        ambassadorExists(_ambassador)
        notNull(_ambassador)
    {
        revokeRole("AMBASSADOR", _ambassador);
        emit AmbassadorRemoved(_ambassador);
    }

    function transferMembershipAmbassador(address _member, address _ambassador)
        external
        memberExists(_member)
        canAlterMembership(_member)
    {
        require(
            _ambassador != msg.sender,
            "NetworkRoles: Cannot transfer membership to caller address"
        );
        require(isAmbassador(_ambassador), "NetworkRoles: provided ambassador does not have role");
        membershipAmbassador[_member] = _ambassador;
        emit MembershipAmbassadorUpdated(_member, _ambassador);
    }

    function dropMembership(address _member)
        external
        memberExists(_member)
        canAlterMembership(_member)
    {
        delete membershipAmbassador[_member];
        emit MembershipAmbassadorUpdated(_member, address(0));
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

    function deployMemberWallet(
        address[] memory _clients,
        address[] memory _guardians,
        address _coSigner,
        address _network,
        address _ambassador,
        uint256 _required
    ) public onlyAmbassador returns (address) {
        address newWallet = walletDeployer.deployWallet(_clients, _guardians, _coSigner, _required);
        membershipAmbassador[newWallet] = _ambassador;
        ICIP36(_network).setCreditLimit(newWallet, ambassadorCreditAllowance[_ambassador]);
        grantRole("MEMBER", newWallet);
        emit MemberAdded(newWallet, _ambassador);
        return newWallet;
    }

    /* ========== VIEWS ========== */

    function isMember(address _member) external view override returns (bool) {
        return hasRole("MEMBER", _member);
    }

    function getMembershipAmbassador(address _member) external view override returns (address) {
        return membershipAmbassador[_member];
    }

    function isAmbassador(address _ambassador) public view override returns (bool) {
        return hasRole("AMBASSADOR", _ambassador);
    }

    function isNetworkOperator(address _operator) public view override returns (bool) {
        return hasRole("OPERATOR", _operator);
    }

    /* ========== MODIFIERS ========== */

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

    modifier canAlterMembership(address _member) {
        require(
            isNetworkOperator(msg.sender) ||
                membershipAmbassador[_member] == msg.sender ||
                msg.sender == _member,
            "NetworkRoles: Caller not authorized to alter membership"
        );
        _;
    }
}
