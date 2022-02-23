// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interface/ICreditRequest.sol";
import "./interface/ICreditRoles.sol";
import "./interface/ICreditManager.sol";
import "../Network/interface/ICIP36.sol";
import "../Network/interface/INetworkToken.sol";
import "../Network/interface/INetworkRoles.sol";
import "hardhat/console.sol";

contract CreditRequest is OwnableUpgradeable, PausableUpgradeable, ICreditRequest {
    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    ICreditRoles public creditRoles;
    ICreditManager public creditManager;
    // network => counterparty => CreditRequest
    mapping(address => mapping(address => CreditRequest)) public requests;

    /* ========== INITIALIZER ========== */

    function initialize(address _creditRoles, address _creditManager) external initializer {
        creditRoles = ICreditRoles(_creditRoles);
        creditManager = ICreditManager(_creditManager);
        __Pausable_init();
        __Ownable_init();
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function createRequest(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) public override {
        INetworkRoles networkRoles = INetworkRoles(INetworkToken(_network).getNetworkRoles());
        address ambassador = networkRoles.getMembershipAmbassador(_counterparty);
        bool hasAccess = msg.sender == _counterparty ||
            msg.sender == ambassador ||
            creditRoles.isRequestOperator(msg.sender);
        require(
            hasAccess,
            "CreditRequest: Caller must be the counterparty's ambassador or the counterparty"
        );
        require(
            requests[_network][_counterparty].creditLimit == 0,
            "CreditRequest: Request already exists"
        );
        uint256 creditBalance = ICIP36(_network).creditBalanceOf(_counterparty);
        require(
            creditBalance <= _creditLimit,
            "CreditRequest: provided credit limit is less than current limit"
        );
        requests[_network][_counterparty] = CreditRequest(
            creditRoles.isRequestOperator(msg.sender),
            false,
            msg.sender,
            _creditLimit
        );
    }

    function approveRequest(address _network, address _counterparty)
        external
        override
        onlyRequestOperator
    {
        require(
            !requests[_network][_counterparty].approved,
            "CreditRequest: request already approved"
        );
        requests[_network][_counterparty].approved = true;
    }

    function acceptRequest(
        address _network,
        address _counterparty,
        address _pool
    ) external onlyUnderwriter {
        require(
            requests[_network][_counterparty].approved,
            "CreditRequest: request is not approved"
        );
        CreditRequest storage request = requests[_network][_counterparty];
        uint256 curCreditLimit = ICIP36(_network).creditLimitOf(_counterparty);
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _counterparty);

        if (underwriter == address(0)) {
            creditManager.createCreditLine(_counterparty, _pool, request.creditLimit, _network);
        } else if (request.unstaking) {
            require(msg.sender != underwriter, "Cannot accept own unstake request");
            creditManager.swapCreditLinePool(_network, _counterparty, _pool);
        } else if (request.creditLimit > curCreditLimit) {
            require(msg.sender == underwriter, "Unauthorized to extend credit line");
            creditManager.extendCreditLine(_network, _counterparty, request.creditLimit);
        }
        delete requests[_network][_counterparty];
    }

    function requestUnstake(address _network, address _counterparty) external {
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _counterparty);
        require(
            msg.sender == underwriter,
            "CreditRequest: Sender must be counterparty's underwriter"
        );
        CreditRequest storage creditRequest = requests[_network][_counterparty];
        if (creditRequest.unstaking) {
            revert("Unstake Request already exists");
        }
        requests[_network][_counterparty] = CreditRequest(true, true, address(0), 0);
    }

    function updateRequestLimit(
        address _network,
        address _counterparty,
        uint256 _creditLimit,
        bool _approved
    ) external override {
        require(
            requests[_network][_counterparty].creditLimit > 0,
            "CreditRequest: request does not exist"
        );
        INetworkRoles networkRoles = INetworkRoles(INetworkToken(_network).getNetworkRoles());
        require(
            networkRoles.getMembershipAmbassador(_counterparty) == msg.sender ||
                creditRoles.isCreditOperator(msg.sender),
            "CreditRequest: Unauthorized to update this request"
        );
        CreditRequest storage creditRequest = requests[_network][_counterparty];
        creditRequest.creditLimit = _creditLimit;
        creditRequest.approved = _approved;
    }

    function deleteRequest(address _network, address _counterparty) external override {
        INetworkRoles networkRoles = INetworkRoles(INetworkToken(_network).getNetworkRoles());
        require(
            networkRoles.getMembershipAmbassador(_counterparty) == msg.sender ||
                creditRoles.isRequestOperator(msg.sender),
            "CreditRequest: Unauthorized to delete this request"
        );
        delete requests[_network][_counterparty];
    }

    /* ========== VIEWS ========== */

    function getCreditRequest(address _network, address _counterparty)
        external
        view
        override
        returns (CreditRequest memory)
    {
        return requests[_network][_counterparty];
    }

    /* ========== MODIFIERS ========== */

    modifier onlyCreditManager() {
        require(
            msg.sender == address(creditManager),
            "CreditRequest: Only callable by CreditManager contract"
        );
        _;
    }

    modifier onlyCreditOperator() {
        require(
            creditRoles.isCreditOperator(msg.sender),
            "CreditRequest: Caller must be a credit operator"
        );
        _;
    }

    modifier onlyRequestOperator() {
        require(
            creditRoles.isRequestOperator(msg.sender),
            "CreditRequest: Caller must be a request operator"
        );
        _;
    }

    modifier onlyUnderwriter() {
        require(
            creditRoles.isUnderwriter(msg.sender),
            "CreditRequest: Caller must be an underwriter"
        );
        _;
    }
}
