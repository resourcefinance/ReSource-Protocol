// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interface/ICreditRequest.sol";
import "./interface/IProtocolRoles.sol";
import "./interface/IUnderwriteManager.sol";
import "../Network/interface/ICIP36.sol";

contract CreditRequest is OwnableUpgradeable, PausableUpgradeable, ICreditRequest {
    uint32 private constant MAX_PPM = 1000000;

    IProtocolRoles public roles;
    IUnderwriteManager public underwriteManager;
    mapping(address => CreditRequest) public requests;

    /*
     *  Modifiers
     */
    modifier onlyAmbassador() {
        require(roles.isAmbassador(msg.sender), "CreditRequest: Caller must be an ambassador");
        _;
    }

    modifier onlyUnderwriteManager() {
        require(msg.sender == address(underwriteManager), "CreditRequest: Caller must be an ambassador");
        _;
    }

    modifier onlyOperator() {
        require(roles.isOperator(msg.sender), "CreditRequest: Caller must be an operator");
        _;
    }
    
    /*
     * External functions
     */
    /// @dev Contract initialzer sets 
    function initialize(address _rolesAddress) external initializer {
        roles = IProtocolRoles(_rolesAddress);
        __Pausable_init();
        __Ownable_init();
    }

    // TODO: callable by membship ambassador, _counterparty, or network operator
    function createRequest(address _counterparty, uint256 _creditLimit, address _networkToken) override external onlyAmbassador {
        // TODO: check that caller (ambassador) is membership ref
        require(requests[_counterparty].creditLimit == 0, "CreditRequest: Request already exists");
        // check if creditLine for counterparty already exists
        requests[_counterparty] = CreditRequest(
            false,
            msg.sender,
            _networkToken,
            _creditLimit
        );
    }
    
    function acceptRequest(address _counterparty) override external onlyUnderwriteManager {
        require(requests[_counterparty].approved, "CreditRequest: request is not approved");
        CreditRequest storage request = requests[_counterparty];
        IUnderwriteManager.CreditLine memory creditLine = underwriteManager.getCreditLine(_counterparty);
        uint256 creditLimit = ICIP36(creditLine.networkToken).creditLimitOf(_counterparty);
        if (request.creditLimit == creditLimit) { // request to unstake 
            require(msg.sender != creditLine.underwriter, "Cannot accept unstake request");
            underwriteManager.swapCreditLine(_counterparty, msg.sender);
        } if (request.creditLimit > creditLimit) { // request to extend
            require(msg.sender == creditLine.underwriter, "Unauthorized to extend credit line");
            underwriteManager.extendCreditLine(_counterparty, calculateRequestCollateral(_counterparty), request.creditLimit);
        } else {
            uint256 collateral = calculateRequestCollateral(_counterparty);
            underwriteManager.createCreditLine(
                _counterparty, 
                msg.sender,
                request.ambassador,
                collateral,
                request.creditLimit,
                request.networkToken);
        }
    }

    function approveRequest(address _counterparty) override external onlyOperator {
        require(!requests[_counterparty].approved, "CreditRequest: request already approved");
        requests[_counterparty].approved = true;
    }

    function updateRequest(address _counterparty, uint256 _creditLimit, bool _approved) override external {
        require(requests[_counterparty].ambassador == msg.sender || roles.isOperator(msg.sender), 
            "CreditRequest: Unauthorized to update this request");
        require(!requests[_counterparty].approved, "CreditRequest: request already approved");
        requests[_counterparty].creditLimit = _creditLimit;
        requests[_counterparty].approved = _approved;
    }

    function deleteRequest(address _counterparty) override external {
        require(requests[_counterparty].ambassador == msg.sender || roles.isOperator(msg.sender), 
            "CreditRequest: Unauthorized to update this request");
        delete requests[_counterparty];
    }

    function calculateRequestCollateral(address _counterparty) override public returns(uint256) {
        CreditRequest memory request = requests[_counterparty];
        require (request.creditLimit > 0, "CreditRequest: Request does not exist");
        uint256 collateralValue = underwriteManager.convertNetworkToCollateral(request.networkToken, request.creditLimit);
        return (collateralValue / underwriteManager.getMinLTV()) / MAX_PPM;
    }

    function getCreditRequest(address _counterparty) external override returns(CreditRequest memory) {
        return requests[_counterparty];
    }

}
