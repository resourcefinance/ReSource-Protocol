// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./interface/IReservePool.sol";
import "./interface/IStableCredit.sol";
import "./interface/INetworkRoles.sol";
import "./interface/IFeeManager.sol";
import "./interface/ISavingsPool.sol";

contract FeeManager is IFeeManager, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    IERC20Upgradeable public collateralToken;
    INetworkRoles public networkRoles;
    IStableCredit public stableCredit;
    ISavingsPool public savingsPool;
    IReservePool public reservePool;

    address public protocolAddress;
    uint256 public savingsFeePercent;
    uint256 public protocolFeePercent;
    uint256 public networkFeePercent;

    uint256 public collectedFees;

    /* ========== INITIALIZER ========== */

    function initialize(
        address _collateraltoken,
        address _networkRoles,
        address _stableCredit,
        address _savingsPool,
        address _reservePool,
        address _protocolAddress,
        uint256 _savingsFeePercent,
        uint256 _protocolFeePercent
    ) external virtual initializer {
        require(
            _savingsFeePercent + _protocolFeePercent <= MAX_PPM,
            "FeeManager: fees must be less than 100%"
        );
        __Ownable_init();
        collateralToken = IERC20Upgradeable(_collateraltoken);
        networkRoles = INetworkRoles(_networkRoles);
        stableCredit = IStableCredit(_stableCredit);
        savingsPool = ISavingsPool(_savingsPool);
        reservePool = IReservePool(_reservePool);
        protocolAddress = _protocolAddress;

        savingsFeePercent = _savingsFeePercent;
        protocolFeePercent = _protocolFeePercent;
        networkFeePercent = MAX_PPM - (savingsFeePercent + protocolFeePercent);
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function collectFees(
        address sender,
        address receiver,
        uint256 amount
    ) external override {
        uint256 totalFee = stableCredit.convertToCollateral(amount);
        collateralToken.safeTransferFrom(sender, address(this), totalFee);
        collectedFees += totalFee;
        emit FeesCollected(sender, totalFee);
    }

    function distributeFees() external {
        uint256 savingsFee = (savingsFeePercent * collectedFees) / MAX_PPM;
        uint256 protocolFee = (protocolFeePercent * collectedFees) / MAX_PPM;
        uint256 networkFee = (networkFeePercent * collectedFees) / MAX_PPM;
        savingsPool.notifyRewardAmount(savingsFee);
        reservePool.stake(networkFee);
        collateralToken.safeTransferFrom(address(this), protocolAddress, protocolFee);
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOperator {
        IERC20Upgradeable(tokenAddress).safeTransfer(msg.sender, tokenAmount);
    }

    function updateFeePercents(uint256 _savingsFeePercent, uint256 _protocolFeePercent)
        external
        onlyOperator
    {
        require(
            _savingsFeePercent + _protocolFeePercent <= MAX_PPM,
            "FeeManager: fees must be less than 100%"
        );
        savingsFeePercent = _savingsFeePercent;
        protocolFeePercent = _protocolFeePercent;
        networkFeePercent = MAX_PPM - (savingsFeePercent + protocolFeePercent);
    }

    /* ========== MODIFIERS ========== */

    modifier onlyOperator() {
        require(
            networkRoles.isNetworkOperator(msg.sender),
            "CreditFeeManager: Caller is not credit operator"
        );
        _;
    }
}
