// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interface/INetworkFeeManager.sol";
import "./interface/INetworkRoles.sol";
import "../Credit/interface/ICreditFeeManager.sol";
import "hardhat/console.sol";

/// @title NetworkFeeManager - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkFeeManager is OwnableUpgradeable, INetworkFeeManager {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /* ========== CONSTANTS ========== */

    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    ICreditFeeManager public creditFeeManager;
    INetworkRoles public networkRoles;
    IERC20Upgradeable public collateralToken;
    uint256 networkFeePercent; // determanistic
    uint256 ambassadorFeePercent;
    uint256 totalFeePercent;
    address network;
    mapping(address => uint256) accruedFees;
    mapping(address => uint256) rewards;

    /* ========== INITIALIZER ========== */

    function initialize(
        address _creditFeeManager,
        address _networkRoles,
        uint256 _totalFeePercent,
        uint256 _ambassadorFeePercent
    ) external virtual initializer {
        __Ownable_init();
        creditFeeManager = ICreditFeeManager(_creditFeeManager);
        networkRoles = INetworkRoles(_networkRoles);
        collateralToken = IERC20Upgradeable(creditFeeManager.getCollateralToken());
        require(
            _ambassadorFeePercent <= MAX_PPM,
            "NetworkFeeManager: Total fee percent greater than 100"
        );
        require(
            _ambassadorFeePercent <= MAX_PPM,
            "NetworkFeeManager: Total fee percent greater than 100"
        );
        totalFeePercent = _totalFeePercent;
        ambassadorFeePercent = _ambassadorFeePercent;
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function collectFees(
        address _network,
        address _member,
        uint256 _transactionValue
    ) external override onlyNetwork {
        uint256 totalFee = creditFeeManager.calculatePercentInCollateral(
            _network,
            totalFeePercent,
            _transactionValue
        );
        collateralToken.safeTransferFrom(_member, address(this), totalFee);
        accruedFees[_member] += totalFee;
        creditFeeManager.collectFees(_network, _member, _transactionValue);
    }

    function registerNetwork(address _network) external onlyNetworkOperator {
        network = _network;
    }

    // TODO: batch claiming / moving
    function claimAmbassadorFees(address _member) external override {
        moveFeesToRewards(_member);
        collateralToken.safeTransfer(msg.sender, rewards[msg.sender]);
        address ambassador = networkRoles.getMembershipAmbassador(_member);
        rewards[ambassador] = 0;
    }

    function claimNetworkFees(address _member) external override onlyNetworkOperator {
        moveFeesToRewards(_member);
        collateralToken.safeTransfer(msg.sender, rewards[address(this)]);
        rewards[address(this)] = 0;
    }

    function moveFeesToRewards(address _member) public {
        uint256 totalFees = accruedFees[_member];
        if (totalFees == 0) {
            return;
        }
        // move ambassador fees
        address ambassador = networkRoles.getMembershipAmbassador(_member);
        uint256 ambassadorFee = (ambassadorFeePercent * totalFees) / MAX_PPM;
        if (ambassador == address(0)) {
            rewards[address(this)] += ambassadorFee;
        } else {
            rewards[ambassador] += ambassadorFee;
        }
        // move network fees
        uint256 networkFee = ((MAX_PPM - ambassadorFeePercent) * totalFees) / MAX_PPM;
        rewards[address(this)] += networkFee;
        accruedFees[_member] = 0;
    }

    function updateAmbassadorFeePercent(uint256 _ambassadorFeePercent) public onlyNetworkOperator {
        require(
            _ambassadorFeePercent <= MAX_PPM,
            "NetworkFeeManager: Total fee percent greater than 100"
        );
        ambassadorFeePercent = _ambassadorFeePercent;
    }

    /* ========== MODIFIERS ========== */

    modifier onlyNetworkOperator() {
        require(
            networkRoles.isNetworkOperator(msg.sender),
            "NetworkFeeManager: Caller is not network operator"
        );
        _;
    }

    modifier onlyNetwork() {
        require(msg.sender == network, "NetworkFeeManager: Caller is not the network");
        _;
    }
}
