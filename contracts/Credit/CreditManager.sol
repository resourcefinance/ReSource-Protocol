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

contract CreditManager is OwnableUpgradeable, PausableUpgradeable, ICreditManager {
    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;
    uint32 private constant MIN_PPT = 1000;

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
        address _networkMember,
        address _pool,
        uint256 _creditLimit,
        address _network
    )
        external
        override
        onlyOperator
        onlyRegisteredNetwork(_network)
        onlyRegisteredPool(_pool)
        onlyNewCreditLine(_network, _networkMember)
    {
        creditLines[_network][_networkMember] = CreditLine(_pool, block.timestamp, _creditLimit);
        ICreditPool(_pool).increaseTotalCredit(_creditLimit);
        totalStakedCollateral += _creditLimit;
        ICIP36(_network).setCreditLimit(_networkMember, _creditLimit);
        emit CreditLineCreated(_network, _networkMember, _pool, _creditLimit, block.timestamp);
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
        address _networkMember,
        uint256 _creditLimit
    ) external override onlyOperator creditLineExists(_network, _networkMember) {
        uint256 curCreditLimit = ICIP36(_network).creditLimitOf(_networkMember);
        require(curCreditLimit < _creditLimit, "CreditManager: Invalid credit limit");
        CreditLine storage creditLine = creditLines[_network][_networkMember];
        ICreditPool(creditLine.creditPool).increaseTotalCredit(_creditLimit - curCreditLimit);
        totalStakedCollateral += _creditLimit - curCreditLimit;
        creditLine.creditLimit = _creditLimit;
        ICIP36(_network).setCreditLimit(_networkMember, _creditLimit);
        emit CreditLineLimitUpdated(_network, _networkMember, _creditLimit);
    }

    function swapCreditLinePool(
        address _network,
        address _networkMember,
        address _pool
    )
        external
        override
        onlyOperator
        onlyRegisteredPool(_pool)
        creditLineExists(_network, _networkMember)
    {
        CreditLine storage creditLine = creditLines[_network][_networkMember];
        ICreditPool(creditLine.creditPool).reduceTotalCredit(creditLine.creditLimit);
        ICreditPool(_pool).increaseTotalCredit(creditLine.creditLimit);
        creditLine.creditPool = _pool;
        emit CreditLinePoolUpdated(_network, _networkMember, _pool);
    }

    function closeCreditLine(address _network, address _networkMember)
        external
        onlyExpiredCreditLine(_network, _networkMember)
        onlyZeroBalance(_network, _networkMember)
    {
        CreditLine memory creditLine = creditLines[_network][_networkMember];
        address underwriter = ICreditPool(creditLine.creditPool).getUnderwriter();
        require(
            underwriter == msg.sender || msg.sender == _networkMember,
            "CreditManager: caller is not underwriter or network member"
        );
        ICreditPool(creditLine.creditPool).reduceTotalCredit(
            ICIP36(_network).creditLimitOf(_networkMember)
        );
        ICIP36(_network).setCreditLimit(_networkMember, 0);
        ICreditPool(creditLine.creditPool).reduceTotalCredit(creditLine.creditLimit);
        totalStakedCollateral -= creditLine.creditLimit;
        delete creditLines[_network][_networkMember];
        emit CreditLineRemoved(_network, _networkMember);
    }

    function renewCreditLine(address _network, address _networkMember)
        external
        override
        onlyOperator
    {
        creditLines[_network][_networkMember].issueDate = block.timestamp;
        emit CreditLineRenewed(_network, _networkMember, block.timestamp);
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

        return ((collateral * MAX_PPM) / creditInCollateralUnits);
    }

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) public view override returns (uint256) {
        uint256 collateralAmount = convertNetworkToCollateral(_networkToken, _amount);
        return ((_percent * collateralAmount) / MAX_PPM);
    }

    function isCreditLineExpired(address _network, address _networkMember)
        public
        view
        override
        returns (bool)
    {
        CreditLine memory creditLine = creditLines[_network][_networkMember];
        return creditLine.issueDate + creditLineExpiration < block.timestamp;
    }

    function getCollateralToken() external view override returns (address) {
        return address(collateralToken);
    }

    function getMinLTV() external view override returns (uint256) {
        return minLTV;
    }

    function getCreditLine(address _network, address _networkMember)
        public
        view
        override
        returns (CreditLine memory)
    {
        return creditLines[_network][_networkMember];
    }

    function getCreditLineUnderwriter(address _network, address _networkMember)
        public
        view
        override
        returns (address)
    {
        address pool = creditLines[_network][_networkMember].creditPool;
        if (pool == address(0)) return pool;
        return ICreditPool(pool).getUnderwriter();
    }

    function getNeededCollateral(address _network, address _networkMember)
        external
        view
        override
        returns (uint256)
    {
        address pool = creditLines[_network][_networkMember].creditPool;
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
        uint256 networkDecimals = IERC20Metadata(_network).decimals();
        if (networkDecimals < collateralDecimals) {
            uint256 delta = collateralDecimals - networkDecimals;
            return (_amount * 10**delta * oracle.getPriceInPPT()) / MIN_PPT;
        } else {
            uint256 delta = networkDecimals - collateralDecimals;
            return ((_amount / 10**delta) * oracle.getPriceInPPT()) / MIN_PPT;
        }
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

    modifier onlyNewCreditLine(address _network, address _networkMember) {
        require(
            creditLines[_network][_networkMember].issueDate == 0,
            "CreditManager: Credit line already exists for network member"
        );
        _;
    }

    modifier creditLineExists(address _network, address _networkMember) {
        require(
            creditLines[_network][_networkMember].issueDate > 0,
            "CreditManager: Credit line does not exist for network member"
        );
        _;
    }

    modifier onlyExpiredCreditLine(address _network, address _networkMember) {
        require(
            isCreditLineExpired(_network, _networkMember),
            "CreditManager: Can't close active credit line"
        );
        _;
    }

    modifier onlyZeroBalance(address _network, address _networkMember) {
        require(
            ICIP36(_network).creditBalanceOf(_networkMember) == 0,
            "CreditManager: Line of Credit has outstanding balance"
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
            "CreditManager: Network token address is not registered"
        );
        _;
    }

    modifier onlyRegisteredPool(address _pool) {
        require(pools[_pool], "CreditManager: Pool is not registered");
        _;
    }
}
