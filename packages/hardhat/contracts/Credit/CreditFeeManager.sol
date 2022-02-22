// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./interface/ICreditFeeManager.sol";
import "./interface/IPriceOracle.sol";
import "./interface/ICreditManager.sol";
import "./interface/ICreditRoles.sol";
import "./interface/ICreditRequest.sol";
import "./interface/ICreditPool.sol";
import "hardhat/console.sol";

contract CreditFeeManager is ICreditFeeManager, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    IERC20Upgradeable public collateralToken;
    IPriceOracle public priceOracle;
    ICreditManager public creditManager;
    ICreditRoles public creditRoles;
    ICreditRequest public creditRequest;
    uint256 public underwriterFeePercent;
    mapping(address => mapping(address => uint256)) accruedFees;
    mapping(address => uint256) rewards;

    /* ========== INITIALIZER ========== */

    function initialize(
        address _priceOracle,
        address _creditManager,
        address _creditRoles,
        address _creditRequest,
        uint256 _underwriterPercent
    ) external virtual initializer {
        __Ownable_init();
        priceOracle = IPriceOracle(_priceOracle);
        creditManager = ICreditManager(_creditManager);
        collateralToken = IERC20Upgradeable(creditManager.getCollateralToken());
        creditRoles = ICreditRoles(_creditRoles);
        creditRequest = ICreditRequest(_creditRequest);
        require(
            _underwriterPercent <= MAX_PPM,
            "CreditFeeManager: underwriter percent must be less than 100%"
        );
        underwriterFeePercent = _underwriterPercent;
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function collectFees(
        address _network,
        address _networkAccount,
        uint256 _transactionValue
    ) external override onlyNetwork {
        uint256 creditFee = calculatePercentInCollateral(
            _network,
            underwriterFeePercent,
            _transactionValue
        );
        collateralToken.safeTransferFrom(_networkAccount, address(this), creditFee);

        verifyCreditLineExpiration(_network, _networkAccount, _transactionValue);

        accruedFees[_network][_networkAccount] = creditFee;
    }

    // TODO: batch claiming / moving
    function claimUnderwriterFees(address _network, address _networkAccount)
        external
        onlyUnderwriter
    {
        moveFeesToRewards(_network, _networkAccount);
        collateralToken.safeTransfer(msg.sender, rewards[msg.sender]);
        rewards[msg.sender] = 0;
    }

    function claimOperatorFees(address _network, address _networkAccount)
        external
        onlyCreditOperator
    {
        moveFeesToRewards(_network, _networkAccount);
        collateralToken.safeTransfer(msg.sender, rewards[address(this)]);
        rewards[address(this)] = 0;
    }

    function moveFeesToRewards(address _network, address _networkAccount) public {
        uint256 fees = accruedFees[_network][_networkAccount];
        accruedFees[_network][_networkAccount] = 0;
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkAccount);
        if (underwriter == address(0)) {
            rewards[address(this)] += fees;
            return;
        }
        address pool = creditManager.getCreditLine(_network, _networkAccount).creditPool;
        uint256 leftoverFee = stakeNeededCollateralInPool(
            _network,
            _networkAccount,
            pool,
            underwriter,
            fees
        );
        splitFeeWithPool(_network, _networkAccount, underwriter, pool, leftoverFee);
    }

    /* ========== VIEWS ========== */

    function getCollateralToken() external view override returns (address) {
        return address(collateralToken);
    }

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) public override returns (uint256) {
        return creditManager.calculatePercentInCollateral(_networkToken, _percent, _amount);
    }

    function getUnderwriterPoolStakePercent(address _network, address _networkAccount)
        public
        returns (uint256)
    {
        address pool = creditManager.getCreditLine(_network, _networkAccount).creditPool;
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkAccount);
        uint256 underwriterCollateral = ICreditPool(pool).balanceOf(underwriter);
        uint256 totalCollateral = ICreditPool(pool).totalSupply();
        return (totalCollateral / underwriterCollateral) * MAX_PPM;
    }

    function updateUnderwriterFeePercent(uint256 _feePercent) external onlyCreditOperator {
        require(
            _feePercent <= MAX_PPM && _feePercent >= 0,
            "CreditFeeManager: invalid fee percent"
        );
        underwriterFeePercent = _feePercent;
    }

    /* ========== PRIVATE ========== */

    function verifyCreditLineExpiration(
        address _network,
        address _networkAccount,
        uint256 _transactionValue
    ) private {
        bool creditLineExpired = creditManager.isCreditLineExpired(_network, _networkAccount);
        uint256 senderBalance = IERC20Upgradeable(_network).balanceOf(_networkAccount);
        bool usingCreditBalance = _transactionValue > senderBalance;

        if (usingCreditBalance && creditLineExpired) {
            require(
                !creditRequest.getCreditRequest(_network, _networkAccount).unstaking,
                "CreditFeeManager: CreditLine is expired"
            );
            creditManager.renewCreditLine(_network, _networkAccount);
        }
    }

    function stakeNeededCollateralInPool(
        address _network,
        address _networkAccount,
        address pool,
        address underwriter,
        uint256 creditFee
    ) private returns (uint256) {
        if (creditManager.isPoolValidLTV(_network, pool)) {
            return creditFee;
        }
        uint256 neededCollateral = creditManager.getNeededCollateral(_network, _networkAccount);
        if (neededCollateral > creditFee) {
            collateralToken.safeTransfer(underwriter, creditFee);
            ICreditPool(pool).stakeFor(underwriter, creditFee);
            creditFee = 0;
        } else {
            collateralToken.safeTransfer(underwriter, neededCollateral);
            ICreditPool(pool).stakeFor(underwriter, neededCollateral);
            creditFee -= neededCollateral;
        }
        console.log(creditFee);
        return creditFee;
    }

    function splitFeeWithPool(
        address _network,
        address _networkAccount,
        address _underwriter,
        address _pool,
        uint256 _fee
    ) private {
        if (_fee == 0) return;
        console.log("FEE: %s", _fee);
        uint256 underwriterPercent = getUnderwriterPoolStakePercent(_network, _networkAccount);
        uint256 underwriterFee = (underwriterPercent * _fee) / MAX_PPM;
        uint256 poolFee = _fee - underwriterFee;
        ICreditPool(_pool).notifyRewardAmount(address(collateralToken), poolFee);
        rewards[_underwriter] += underwriterFee;
    }

    /* ========== MODIFIERS ========== */

    modifier onlyCreditOperator() {
        require(
            creditRoles.isCreditOperator(msg.sender),
            "CreditFeeManager: Caller is not credit operator"
        );
        _;
    }

    modifier onlyUnderwriter() {
        require(
            creditRoles.isUnderwriter(msg.sender),
            "CreditFeeManager: Caller is not an underwriter"
        );
        _;
    }

    modifier onlyNetwork() {
        require(creditRoles.isNetwork(msg.sender), "CreditFeeManager: Caller is not a network");
        _;
    }
}
