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
    // network => member => CreditRequest
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
        address _networkMember,
        uint256 _creditLimit
    ) public override onlyValidRequester(_network, _networkMember) {
        require(
            requests[_network][_networkMember].creditLimit == 0,
            "CreditRequest: Request already exists"
        );
        uint256 creditBalance = ICIP36(_network).creditBalanceOf(_networkMember);
        require(
            creditBalance <= _creditLimit,
            "CreditRequest: provided credit limit is less than current limit"
        );
        bool approved = creditRoles.isRequestOperator(msg.sender);
        requests[_network][_networkMember] = CreditRequest(approved, false, _creditLimit);
        emit CreditRequestCreated(_network, _networkMember, msg.sender, _creditLimit, approved);
    }

    function approveRequest(address _network, address _networkMember)
        external
        override
        onlyRequestOperator
    {
        require(
            !requests[_network][_networkMember].approved,
            "CreditRequest: request already approved"
        );
        require(
            requests[_network][_networkMember].creditLimit != 0,
            "CreditRequest: Request does not exist"
        );
        requests[_network][_networkMember].approved = true;
        emit CreditRequestUpdated(
            _network,
            _networkMember,
            requests[_network][_networkMember].creditLimit,
            true
        );
    }

    function acceptRequest(
        address _network,
        address _networkMember,
        address _pool
    ) external onlyUnderwriter {
        require(
            requests[_network][_networkMember].approved,
            "CreditRequest: request is not approved"
        );
        CreditRequest memory request = requests[_network][_networkMember];
        uint256 curCreditLimit = ICIP36(_network).creditLimitOf(_networkMember);
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkMember);

        if (underwriter == address(0)) {
            creditManager.createCreditLine(_networkMember, _pool, request.creditLimit, _network);
        } else if (request.unstaking) {
            require(msg.sender != underwriter, "CreditRequest: Cannot accept own unstake request");
            creditManager.swapCreditLinePool(_network, _networkMember, _pool);
        } else {
            require(
                request.creditLimit > curCreditLimit,
                "CreditRequest: request limit is less than current limit"
            );
            require(msg.sender == underwriter, "CreditRequest: Unauthorized to extend credit line");
            creditManager.extendCreditLine(_network, _networkMember, request.creditLimit);
        }
        emit CreditRequestRemoved(_network, _networkMember);
        delete requests[_network][_networkMember];
    }

    function createAndAcceptRequest(
        address _network,
        address _networkMember,
        uint256 _creditLimit,
        address _pool
    ) external onlyUnderwriter onlyRequestOperator {
        uint256 curCreditLimit = ICIP36(_network).creditLimitOf(_networkMember);
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkMember);

        if (underwriter == address(0)) {
            creditManager.createCreditLine(_networkMember, _pool, _creditLimit, _network);
        } else if (_creditLimit > curCreditLimit) {
            creditManager.extendCreditLine(_network, _networkMember, _creditLimit);
        }
    }

    function requestUnstake(address _network, address _networkMember) external {
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkMember);
        require(
            msg.sender == underwriter,
            "CreditRequest: Sender must be network member's underwriter"
        );
        CreditRequest storage creditRequest = requests[_network][_networkMember];
        require(!creditRequest.unstaking, "CreditRequest: Unstake Request already exists");
        requests[_network][_networkMember] = CreditRequest(true, true, 0);
        emit UnstakeRequestCreated(_network, _networkMember);
    }

    function updateRequestLimit(
        address _network,
        address _networkMember,
        uint256 _creditLimit,
        bool _approved
    ) external override onlyValidRequester(_network, _networkMember) {
        require(
            requests[_network][_networkMember].creditLimit > 0,
            "CreditRequest: request does not exist"
        );
        CreditRequest storage creditRequest = requests[_network][_networkMember];
        creditRequest.creditLimit = _creditLimit;
        creditRequest.approved = _approved;
        emit CreditRequestUpdated(_network, _networkMember, _creditLimit, _approved);
    }

    function deleteRequest(address _network, address _networkMember)
        external
        override
        onlyValidRequester(_network, _networkMember)
    {
        delete requests[_network][_networkMember];
        emit CreditRequestRemoved(_network, _networkMember);
    }

    /* ========== VIEWS ========== */

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
                !requests[_network][_networkMember].unstaking,
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

    modifier onlyValidRequester(address _network, address _networkMember) {
        bool hasAccess = ICIP36(_network).canRequestCredit(msg.sender, _networkMember) ||
            creditRoles.isRequestOperator(msg.sender);
        require(
            hasAccess,
            "CreditRequest: Caller must be the network member's ambassador or the network member"
        );
        _;
    }
}
