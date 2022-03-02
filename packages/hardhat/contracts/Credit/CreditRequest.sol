// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./interface/ICreditRequest.sol";
import "./interface/ICreditRoles.sol";
import "./interface/ICreditManager.sol";
import "../Network/interface/ICIP36.sol";

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
        bool hasAccess = ICIP36(_network).canIssueCredit(msg.sender) ||
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
        bool approved = creditRoles.isRequestOperator(msg.sender);
        requests[_network][_counterparty] = CreditRequest(approved, false, _creditLimit);
        emit CreditRequestCreated(_network, _counterparty, msg.sender, _creditLimit, approved);
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
        emit CreditRequestApproved(_network, _counterparty);
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
        emit CreditRequestRemoved(_network, _counterparty);
        delete requests[_network][_counterparty];
    }

    function requestUnstake(address _network, address _counterparty) external {
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _counterparty);
        require(
            msg.sender == underwriter,
            "CreditRequest: Sender must be counterparty's underwriter"
        );
        CreditRequest storage creditRequest = requests[_network][_counterparty];
        require(!creditRequest.unstaking, "CreditRequest: Unstake Request already exists");
        requests[_network][_counterparty] = CreditRequest(true, true, 0);
        emit UnstakeRequestCreated(_network, _counterparty);
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
        bool hasAccess = ICIP36(_network).canIssueCredit(msg.sender) ||
            creditRoles.isRequestOperator(msg.sender);
        require(hasAccess, "CreditRequest: Unauthorized to update this request");
        CreditRequest storage creditRequest = requests[_network][_counterparty];
        creditRequest.creditLimit = _creditLimit;
        creditRequest.approved = _approved;
        emit CreditRequestUpdated(_network, _counterparty, _creditLimit, _approved);
    }

    function deleteRequest(address _network, address _counterparty) external override {
        bool hasAccess = ICIP36(_network).canIssueCredit(msg.sender) ||
            creditRoles.isRequestOperator(msg.sender);
        require(hasAccess, "CreditRequest: Unauthorized to delete this request");
        delete requests[_network][_counterparty];
        emit CreditRequestRemoved(_network, _counterparty);
    }

    /* ========== VIEWS ========== */

    function getCreditRequest(address _network, address _counterparty)
        public
        view
        override
        returns (CreditRequest memory)
    {
        return requests[_network][_counterparty];
    }

    function verifyCreditLineExpiration(
        address _network,
        address _networkMember,
        uint256 _transactionValue
    ) external override {
        bool creditLineExpired = creditManager.isCreditLineExpired(_network, _networkMember);
        uint256 senderBalance = IERC20Upgradeable(_network).balanceOf(_networkMember);
        bool usingCreditBalance = _transactionValue > senderBalance;

        if (usingCreditBalance && creditLineExpired) {
            require(
                !getCreditRequest(_network, _networkMember).unstaking,
                "CreditFeeManager: CreditLine is expired"
            );
            creditManager.renewCreditLine(_network, _networkMember);
        }
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
