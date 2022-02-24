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
        address _networkMember,
        uint256 _transactionValue
    ) external override onlyNetwork {
        uint256 creditFee = calculatePercentInCollateral(
            _network,
            underwriterFeePercent,
            _transactionValue
        );
        collateralToken.safeTransferFrom(_networkMember, address(this), creditFee);
        creditRequest.verifyCreditLineExpiration(_network, _networkMember, _transactionValue);
        accruedFees[_network][_networkMember] = creditFee;
        emit FeesCollected(_network, _networkMember, creditFee);
    }

    function claimUnderwriterFees(address _network, address[] memory _networkMembers)
        external
        onlyUnderwriter
    {
        splitFees(_network, _networkMembers);
        if (rewards[msg.sender] == 0) return;
        collateralToken.safeTransfer(msg.sender, rewards[msg.sender]);
        emit UnderwriterFeesClaimed(msg.sender, rewards[msg.sender]);
        rewards[msg.sender] = 0;
    }

    function claimOperatorFees(address _network, address[] memory _networkMembers)
        external
        onlyCreditOperator
    {
        splitFees(_network, _networkMembers);
        collateralToken.safeTransfer(msg.sender, rewards[address(this)]);
        emit OperatorFeesClaimed(msg.sender, rewards[address(this)]);
        rewards[address(this)] = 0;
    }

    function splitFees(address _network, address[] memory _networkMembers) public {
        for (uint256 i = 0; i < _networkMembers.length; i++) {
            uint256 fees = accruedFees[_network][_networkMembers[i]];
            accruedFees[_network][_networkMembers[i]] = 0;
            address underwriter = creditManager.getCreditLineUnderwriter(
                _network,
                _networkMembers[i]
            );
            if (underwriter == address(0)) {
                rewards[address(this)] += fees;
                emit OperatorRewardsUpdated(rewards[address(this)]);
                return;
            }
            address pool = creditManager.getCreditLine(_network, _networkMembers[i]).creditPool;
            uint256 leftoverFee = stakeNeededCollateralInPool(
                _network,
                _networkMembers[i],
                pool,
                underwriter,
                fees
            );
            splitFeeWithPool(_network, _networkMembers[i], underwriter, pool, leftoverFee);
        }
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        require(tokenAddress != address(collateralToken), "Cannot withdraw staking token");
        IERC20Upgradeable(tokenAddress).safeTransfer(owner(), tokenAmount);
    }

    function updateUnderwriterFeePercent(uint256 _feePercent) external onlyCreditOperator {
        require(
            _feePercent <= MAX_PPM && _feePercent >= 0,
            "CreditFeeManager: invalid fee percent"
        );
        underwriterFeePercent = _feePercent;
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

    function getUnderwriterPoolStakePercent(address _network, address _networkMember)
        public
        returns (uint256)
    {
        address pool = creditManager.getCreditLine(_network, _networkMember).creditPool;
        address underwriter = creditManager.getCreditLineUnderwriter(_network, _networkMember);
        uint256 underwriterCollateral = ICreditPool(pool).balanceOf(underwriter);
        uint256 totalCollateral = ICreditPool(pool).totalSupply();
        return (totalCollateral / underwriterCollateral) * MAX_PPM;
    }

    function getAccruedFees(address[] memory _members, address _network)
        external
        view
        returns (uint256 totalFees)
    {
        for (uint256 i = 0; i < _members.length; i++) {
            totalFees += accruedFees[_network][_members[i]];
        }
    }

    /* ========== PRIVATE ========== */

    function stakeNeededCollateralInPool(
        address _network,
        address _networkMember,
        address pool,
        address underwriter,
        uint256 creditFee
    ) private returns (uint256) {
        if (creditManager.isPoolValidLTV(_network, pool)) return creditFee;
        uint256 neededCollateral = creditManager.getNeededCollateral(_network, _networkMember);
        if (neededCollateral > creditFee) {
            collateralToken.safeTransfer(underwriter, creditFee);
            ICreditPool(pool).stakeFor(underwriter, creditFee);
            emit UnderwriterRewardsStaked(underwriter, creditFee);
            creditFee = 0;
        } else {
            collateralToken.safeTransfer(underwriter, neededCollateral);
            ICreditPool(pool).stakeFor(underwriter, neededCollateral);
            emit UnderwriterRewardsStaked(underwriter, neededCollateral);
            creditFee -= neededCollateral;
        }
        return creditFee;
    }

    function splitFeeWithPool(
        address _network,
        address _networkMember,
        address _underwriter,
        address _pool,
        uint256 _fee
    ) private {
        if (_fee == 0) return;
        uint256 underwriterPercent = getUnderwriterPoolStakePercent(_network, _networkMember);
        uint256 underwriterFee = (underwriterPercent * _fee) / MAX_PPM;
        uint256 poolFee = _fee - underwriterFee;
        ICreditPool(_pool).notifyRewardAmount(address(collateralToken), poolFee);
        emit PoolRewardsUpdated(_underwriter, poolFee);
        rewards[_underwriter] += underwriterFee;
        emit UnderwriterRewardsUpdated(_underwriter, underwriterFee);
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
