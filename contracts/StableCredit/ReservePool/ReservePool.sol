// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "../interface/IReservePool.sol";
import "../interface/INetworkRoles.sol";
import "../interface/IStableCredit.sol";

contract ReservePool is OwnableUpgradeable, IReservePool, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /* ========== STATE VARIABLES ========== */

    IStableCredit public stableCredit;
    INetworkRoles public networkRoles;
    IERC20Upgradeable public collateralToken;

    uint256 internal _totalCollateral;

    /* ========== INITIALIZER ========== */

    function __ReservePool_init(address _stableCredit) internal initializer {
        stableCredit = IStableCredit(_stableCredit);
        collateralToken = IERC20Upgradeable(stableCredit.getCollateralToken());
        networkRoles = INetworkRoles(stableCredit.getRoles());
        __ReentrancyGuard_init();
    }

    /* ========== VIEWS ========== */

    function totalCollateral() external view returns (uint256) {
        return _totalCollateral;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(uint256 amount) public virtual override nonReentrant onlyAuthorized {
        require(amount > 0, "ReservePool: Cannot stake 0");
        _totalCollateral += amount;
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public virtual nonReentrant onlyAuthorized {
        require(amount > 0, "ReservePool: Cannot withdraw 0");
        _totalCollateral -= amount;
        collateralToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    // function demurrage(address ) TODO:

    /* ========== RESTRICTED FUNCTIONS ========== */

    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) public onlyOwner {
        require(
            tokenAddress != address(collateralToken),
            "ReservePool: Cannot withdraw staking token"
        );
        IERC20Upgradeable(tokenAddress).safeTransfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    /* ========== MODIFIERS ========== */

    modifier onlyAuthorized() {
        require(stableCredit.isAuthorized(msg.sender), "ReservePool: caller not authorized");
        _;
    }

    /* ========== EVENTS ========== */

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Recovered(address token, uint256 amount);
}
