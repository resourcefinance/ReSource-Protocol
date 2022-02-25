// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interface/IPriceOracle.sol";
import "./interface/ICreditManager.sol";
import "./interface/ICreditRoles.sol";
import "./interface/ICreditPool.sol";
import "../Network/interface/ICIP36.sol";
import "hardhat/console.sol";

contract CreditManager is OwnableUpgradeable, PausableUpgradeable, ICreditManager {
    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    IERC20 public collateralToken;
    ICreditRoles public creditRoles;
    IPriceOracle public oracle;
    uint256 public totalStakedCollateral;
    uint256 public minLTV;
    uint256 public creditLineExpiration;
    // network => member => creditline
    mapping(address => mapping(address => CreditLine)) public creditLines;
    // poolAddress => pool
    mapping(address => bool) public pools;

    /* ========== INITIALIZER ========== */

    function initialize(
        address collateralTokenAddress,
        address _creditRoles,
        address _oracle
    ) external virtual initializer {
        collateralToken = IERC20(collateralTokenAddress);
        creditRoles = ICreditRoles(_creditRoles);
        oracle = IPriceOracle(_oracle);
        _setMinLTV(200000);
        _setCreditLineExpirationDays(180 days);
        __Ownable_init();
        __Pausable_init();
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function createCreditLine(
        address _counterparty,
        address _pool,
        uint256 _creditLimit,
        address _network
    ) external override onlyOperator onlyRegisteredNetwork(_network) {
        creditLines[_network][_counterparty] = CreditLine(_pool, block.timestamp);
        ICreditPool(_pool).increaseTotalCredit(_creditLimit);
        ICIP36(_network).setCreditLimit(_counterparty, _creditLimit);
        emit CreditLineCreated(_network, _counterparty, _pool, _creditLimit, block.timestamp);
    }

    function registerCreditPool(address _pool) external onlyOperator {
        address underwriter = ICreditPool(_pool).getUnderwriter();
        require(
            creditRoles.isUnderwriter(underwriter),
            "CreditManager: pool underwriter is invalid"
        );
        pools[_pool] = true;
        emit CreditPoolAdded(_pool, underwriter);
    }

    function extendCreditLine(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) external override onlyOperator {
        uint256 curCreditLimit = ICIP36(_network).creditLimitOf(_counterparty);
        require(curCreditLimit < _creditLimit, "CreditManager: Invalid credit limit");
        CreditLine storage creditLine = creditLines[_network][_counterparty];
        ICreditPool(creditLine.creditPool).increaseTotalCredit(_creditLimit - curCreditLimit);
        ICIP36(_network).setCreditLimit(_counterparty, _creditLimit);
        emit CreditLineLimitUpdated(_network, _counterparty, _creditLimit);
    }

    function swapCreditLinePool(
        address _network,
        address _counterparty,
        address _pool
    ) external override onlyOperator {
        CreditLine storage creditLine = creditLines[_network][_counterparty];
        creditLine.creditPool = _pool;
        emit CreditLinePoolUpdated(_network, _counterparty, _pool);
    }

    function closeCreditLine(address _network, address _counterparty) external {
        CreditLine storage creditLine = creditLines[_network][_counterparty];
        address underwriter = ICreditPool(creditLine.creditPool).getUnderwriter();
        require(
            underwriter == msg.sender || msg.sender == _counterparty,
            "CreditManager: caller is not underwriter or counterparty"
        );
        require(
            isCreditLineExpired(_network, _counterparty),
            "CreditManager: Can't close active credit line"
        );
        require(
            ICIP36(_network).creditBalanceOf(_counterparty) == 0,
            "CreditManager: Line of Credit has outstanding balance"
        );
        ICreditPool(creditLine.creditPool).reduceTotalCredit(
            ICIP36(_network).creditLimitOf(_counterparty)
        );
        delete creditLines[_network][_counterparty];
        ICIP36(_network).setCreditLimit(_counterparty, 0);
        emit CreditLineRemoved(_network, _counterparty);
    }

    function renewCreditLine(address _network, address _counterparty)
        external
        override
        onlyOperator
    {
        creditLines[_network][_counterparty].issueDate = block.timestamp;
        emit CreditLineRenewed(_network, _counterparty, block.timestamp);
    }

    /* ========== VIEWS ========== */

    function isPoolValidLTV(address _network, address _pool) public view override returns (bool) {
        uint256 LTV = calculatePoolLTV(_network, _pool);
        return LTV > minLTV;
    }

    function calculatePoolLTV(address _network, address _pool) public view returns (uint256) {
        uint256 collateral = ICreditPool(_pool).totalSupply();
        if (collateral == 0) return 0;

        uint256 creditInCollateralUnits = convertNetworkToCollateral(
            _network,
            ICreditPool(_pool).getTotalCredit()
        );
        return (creditInCollateralUnits / collateral) * MAX_PPM;
    }

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) public view override returns (uint256) {
        uint256 collateralAmount = convertNetworkToCollateral(_networkToken, _amount);
        return ((_percent * collateralAmount) / MAX_PPM);
    }

    function isCreditLineExpired(address _network, address _counterparty)
        public
        view
        override
        returns (bool)
    {
        CreditLine storage creditLine = creditLines[_network][_counterparty];
        return creditLine.issueDate + creditLineExpiration >= block.timestamp;
    }

    function getCollateralToken() external view override returns (address) {
        return address(collateralToken);
    }

    function getMinLTV() external view override returns (uint256) {
        return minLTV;
    }

    function getCreditLine(address _network, address _counterparty)
        public
        view
        override
        returns (CreditLine memory)
    {
        return creditLines[_network][_counterparty];
    }

    function getCreditLineUnderwriter(address _network, address _counterparty)
        public
        view
        override
        returns (address)
    {
        address pool = creditLines[_network][_counterparty].creditPool;
        if (pool == address(0)) return pool;
        return ICreditPool(pool).getUnderwriter();
    }

    function getNeededCollateral(address _network, address _counterparty)
        external
        view
        override
        returns (uint256)
    {
        address pool = creditLines[_network][_counterparty].creditPool;
        if (isPoolValidLTV(_network, pool)) return 0;
        uint256 totalCredit = ICreditPool(pool).getTotalCredit();
        uint256 creditInCollateral = convertNetworkToCollateral(_network, totalCredit);
        uint256 minimumCollateral = (creditInCollateral * minLTV) / MAX_PPM;
        return minimumCollateral - ICreditPool(pool).totalSupply();
    }

    function convertNetworkToCollateral(address _network, uint256 _amount)
        public
        view
        override
        returns (uint256)
    {
        uint256 collateralDecimals = IERC20Metadata(address(collateralToken)).decimals();
        uint256 decimalConversion = collateralDecimals - IERC20Metadata(_network).decimals();
        return ((_amount * 10**decimalConversion) / oracle.getPrice()) * 10**collateralDecimals;
    }

    /* ========== PRIVATE FUNCTIONS ========== */

    function _setMinLTV(uint32 _percentage) private {
        require(_percentage <= MAX_PPM, ">percentage");
        minLTV = _percentage;
    }

    function _setCreditLineExpirationDays(uint32 _days) private {
        require(_days >= 1 days, "expiration day must be greater than 0");
        creditLineExpiration = _days;
    }

    /* ========== MODIFIERS ========== */

    modifier onlyOperator() {
        require(
            creditRoles.isCreditOperator(msg.sender),
            "CreditManager: Caller must be an operator"
        );
        _;
    }

    modifier onlyUnderwriter(address _underwriter) {
        require(
            creditRoles.isUnderwriter(_underwriter),
            "CreditManager: Underwriter address is not authorized"
        );
        _;
    }

    modifier onlyRegisteredNetwork(address _network) {
        require(
            creditRoles.isNetwork(_network),
            "CreditRequest: Network token address is not registered"
        );
        _;
    }

    modifier onlyRegisteredPool(address _pool) {
        require(pools[_pool], "CreditRequest: Pool is not registered");
        _;
    }
}