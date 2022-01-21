// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interface/ICreditRequest.sol";
import "./interface/IProtocolRoles.sol";
import "./interface/IUnderwriteManager.sol";
import "../Network/interface/ICIP36.sol";

contract CreditRequest is OwnableUpgradeable, PausableUpgradeable, ICreditRequest {
    /*
     *  Constants
     */
    uint32 private constant MAX_PPM = 1000000;
    
    /*
     *  Storage
     */
    IProtocolRoles public roles;
    IUnderwriteManager public underwriteManager;
    // counterparty => Request
    mapping(address => mapping(address => CreditRequest)) public requests;
    // network => member => ambassador
    mapping(address => mapping(address => address)) membership;
    // network => member => ambassador => invited
    mapping(address => mapping(address => mapping(address => bool))) ambassadorInvites;

    /*
     *  Modifiers
     */
    modifier onlyAmbassador() {
        require(roles.isAmbassador(msg.sender), "CreditRequest: Caller must be an ambassador");
        _;
    }

    modifier onlyUnderwriteManager() {
        require(msg.sender == address(underwriteManager), "CreditRequest: Only callable by underwriteManager");
        _;
    }

    modifier onlyOperator() {
        require(roles.isOperator(msg.sender), "CreditRequest: Caller must be an operator");
        _;
    }
    
    /*
     * External functions
     */
    /// @notice Contract initializer
    /// @dev initializes the roles and UnderwriteManager interfaces
    /// @param _rolesAddress address of the ProtocolRoles contract
    /// @param _underwriteManager address of the UnerwriteManager contract
    function initialize(address _rolesAddress, address _underwriteManager) external initializer {
        roles = IProtocolRoles(_rolesAddress);
        underwriteManager = IUnderwriteManager(_underwriteManager);
        __Pausable_init();
        __Ownable_init();
    }

    function createRequest(address _counterparty, uint256 _creditLimit, address _network) override external {
        bool hasAccess = roles.isAmbassador(msg.sender) || msg.sender == _counterparty;
        require(hasAccess, "CreditRequest: Caller must be an ambassador or counterparty");
        require(membership[_network][_counterparty] == msg.sender, "CreditRequest: Caller is not counterparty ambassador");
        require(requests[_network][_counterparty].creditLimit == 0, "CreditRequest: Request already exists");
        requests[_network][_counterparty] = CreditRequest(
            false,
            msg.sender,
            _network,
            _creditLimit
        );
    }
    
    function acceptRequest(address _network, address _counterparty) override external onlyUnderwriteManager {
        require(requests[_network][_counterparty].approved, "CreditRequest: request is not approved");
        CreditRequest storage request = requests[_network][_counterparty];
        IUnderwriteManager.CreditLine memory creditLine = underwriteManager.getCreditLine(_network, _counterparty);
        uint256 creditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);
        if (request.creditLimit == creditLimit) { // request to unstake 
            require(msg.sender != creditLine.underwriter, "Cannot accept unstake request");
            underwriteManager.swapCreditLine(_network, _counterparty, msg.sender);
        } if (request.creditLimit > creditLimit) { // request to extend
            require(msg.sender == creditLine.underwriter, "Unauthorized to extend credit line");
            underwriteManager.extendCreditLine(_network, _counterparty, msg.sender, calculateRequestCollateral(_network, _counterparty), request.creditLimit);
        } else {
            uint256 collateral = calculateRequestCollateral(_network, _counterparty);
            underwriteManager.createCreditLine(
                _counterparty, 
                msg.sender,
                collateral,
                request.creditLimit,
                request.network);
        }
    }

    function approveRequest(address _network, address _counterparty) override external onlyOperator {
        require(!requests[_network][_counterparty].approved, "CreditRequest: request already approved");
        requests[_network][_counterparty].approved = true;
    }

    function updateRequestLimit(address _network, address _counterparty, uint256 _creditLimit) override external {
        require(requests[_network][_counterparty].creditLimit > 0, "CreditRequest: request does not exist");
        require(requests[_network][_counterparty].ambassador == msg.sender || roles.isOperator(msg.sender), 
            "CreditRequest: Unauthorized to update this request");
        requests[_network][_counterparty].creditLimit = _creditLimit;
    }

    function deleteRequest(address _network, address _counterparty) override external {
        require(requests[_network][_counterparty].ambassador == msg.sender || roles.isOperator(msg.sender), 
            "CreditRequest: Unauthorized to update this request");
        delete requests[_network][_counterparty];
    }

    function calculateRequestCollateral(address _network, address _counterparty) override public returns(uint256) {
        CreditRequest memory request = requests[_network][_counterparty];
        require (request.creditLimit > 0, "CreditRequest: Request does not exist");
        uint256 creditLimitInCollateral = underwriteManager.convertNetworkToCollateral(request.network, request.creditLimit);
        return (creditLimitInCollateral / underwriteManager.getMinLTV()) / MAX_PPM;
    }

    function getCreditRequest(address _network, address _counterparty) external view override returns(CreditRequest memory) {
        return requests[_network][_counterparty];
    }

    function inviteCounterparty(address _network, address _counterparty) external override onlyAmbassador{
        require(!ambassadorInvites[_network][_counterparty][msg.sender], "CreditRequest: Invite already exists");
        ambassadorInvites[_network][_counterparty][msg.sender] = true;
    }

    function acceptAmbassadorInvitation(address _network, address _ambassador) external override { 
        require(ambassadorInvites[_network][msg.sender][_ambassador], "CreditRequest: Invite does not exist");
        membership[_network][msg.sender] = _ambassador;
    }

    function getAmbassador(address _network, address _counterparty) external override view returns(address) {
        return membership[_network][_counterparty];
    }

    function isUnstaking(address _network, address _counterparty) external override view returns(bool) {
        CreditRequest storage request = requests[_network][_counterparty];
        uint256 creditLimit = ICIP36(_network).creditLimitOf(_counterparty);
        return request.creditLimit == creditLimit;
    }
}
