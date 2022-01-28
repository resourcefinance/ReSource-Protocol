// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interface/ICreditRequest.sol";
import "./interface/IProtocolRoles.sol";
import "./interface/ICreditManager.sol";
import "../Network/interface/ICIP36.sol";
import "../Network/interface/INetworkToken.sol";
import "../Network/interface/INetworkRoles.sol";

contract CreditRequest is OwnableUpgradeable, PausableUpgradeable, ICreditRequest {
    /*
     *  Constants
     */
    uint32 private constant MAX_PPM = 1000000;

    /*
     *  Storage
     */
    IProtocolRoles public roles;
    ICreditManager public creditManager;
    // network => counterparty => CreditRequest
    mapping(address => mapping(address => CreditRequest)) public requests;

    /*
     *  Modifiers
     */
    modifier onlyCreditManager() {
        require(
            msg.sender == address(creditManager),
            "CreditRequest: Only callable by CreditManager contract"
        );
        _;
    }

    modifier onlyOperator() {
        require(roles.isProtocolOperator(msg.sender), "CreditRequest: Caller must be an operator");
        _;
    }

    /*
     * External functions
     */
    /// @notice Contract initializer
    /// @dev initializes the roles and CreditManager interfaces
    /// @param _rolesAddress address of the ProtocolRoles contract
    /// @param _creditManager address of the UnerwriteManager contract
    function initialize(address _rolesAddress, address _creditManager) external initializer {
        roles = IProtocolRoles(_rolesAddress);
        creditManager = ICreditManager(_creditManager);
        __Pausable_init();
        __Ownable_init();
    }

    function createRequest(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) public override {
        INetworkRoles networkRoles = INetworkRoles(INetworkToken(_network).getNetworkRoles());
        address ambassador = networkRoles.getMemberAmbassador(_counterparty);
        bool hasAccess = msg.sender == _counterparty || msg.sender == ambassador;
        require(
            hasAccess,
            "CreditRequest: Caller must be the counterparty's ambassador or the counterparty"
        );
        require(
            requests[_network][_counterparty].creditLimit == 0,
            "CreditRequest: Request already exists"
        );
        uint256 creditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);
        require(
            _creditLimit >= creditLimit,
            "CreditRequest: provided credit limit is less than current limit"
        );
        requests[_network][_counterparty] = CreditRequest(
            false,
            msg.sender,
            _network,
            _creditLimit
        );
    }

    function acceptRequest(address _network, address _counterparty)
        external
        override
        onlyCreditManager
    {
        require(
            requests[_network][_counterparty].approved,
            "CreditRequest: request is not approved"
        );
        CreditRequest storage request = requests[_network][_counterparty];
        ICreditManager.CreditLine memory creditLine = creditManager.getCreditLine(
            _network,
            _counterparty
        );
        uint256 curCreditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);

        if (creditLine.underwriter == address(0)) {
            uint256 collateral = calculateRequestCollateral(_network, _counterparty);
            creditManager.createCreditLine(
                _counterparty,
                msg.sender,
                collateral,
                request.creditLimit,
                request.network
            );
        } else if (request.creditLimit == curCreditLimit) {
            // unstake request
            require(msg.sender != creditLine.underwriter, "Cannot accept unstake request");
            creditManager.swapCreditLineUnderwriter(_network, _counterparty, msg.sender);
        } else if (request.creditLimit > curCreditLimit) {
            // extend request
            require(msg.sender == creditLine.underwriter, "Unauthorized to extend credit line");
            creditManager.extendCreditLine(
                _network,
                _counterparty,
                msg.sender,
                calculateRequestCollateral(_network, _counterparty),
                request.creditLimit
            );
        }
        delete requests[_network][_counterparty];
    }

    function approveRequest(address _network, address _counterparty)
        external
        override
        onlyOperator
    {
        require(
            !requests[_network][_counterparty].approved,
            "CreditRequest: request already approved"
        );
        requests[_network][_counterparty].approved = true;
    }

    function requestUnstake(address _network, address _counterparty) external {
        ICreditManager.CreditLine memory creditLine = creditManager.getCreditLine(
            _network,
            _counterparty
        );
        CreditRequest storage creditRequest = requests[_network][_counterparty];
        uint256 creditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);
        if (creditRequest.creditLimit == creditLimit) {
            revert("Unstake Request already exists");
        }
        if (creditRequest.creditLimit > creditLimit) {
            revert("Extension Request already exists");
        } else {
            createRequest(creditLine.network, _counterparty, creditLimit, "UNSTAKE");
        }
    }

    function updateRequestLimit(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) external override {
        require(
            requests[_network][_counterparty].creditLimit > 0,
            "CreditRequest: request does not exist"
        );
        require(
            requests[_network][_counterparty].ambassador == msg.sender ||
                roles.isProtocolOperator(msg.sender),
            "CreditRequest: Unauthorized to update this request"
        );
        requests[_network][_counterparty].creditLimit = _creditLimit;
    }

    function deleteRequest(address _network, address _counterparty) external override {
        require(
            requests[_network][_counterparty].ambassador == msg.sender ||
                roles.isProtocolOperator(msg.sender),
            "CreditRequest: Unauthorized to update this request"
        );
        delete requests[_network][_counterparty];
    }

    /*
     * View functions
     */
    function calculateRequestCollateral(address _network, address _counterparty)
        public
        override
        returns (uint256)
    {
        CreditRequest memory request = requests[_network][_counterparty];
        require(request.creditLimit > 0, "CreditRequest: Request does not exist");
        uint256 creditLimitInCollateral = creditManager.convertNetworkToCollateral(
            request.network,
            request.creditLimit
        );
        return (creditLimitInCollateral / creditManager.getMinLTV()) / MAX_PPM;
    }

    function getCreditRequest(address _network, address _counterparty)
        external
        view
        override
        returns (CreditRequest memory)
    {
        return requests[_network][_counterparty];
    }

    function isUnstaking(address _network, address _counterparty)
        external
        view
        override
        returns (bool)
    {
        CreditRequest storage request = requests[_network][_counterparty];
        uint256 creditLimit = ICIP36(_network).creditLimitOf(_counterparty);
        return request.creditLimit == creditLimit;
    }
}
