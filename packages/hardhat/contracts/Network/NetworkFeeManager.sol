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
    // look into a percentage libarary for using MAX_PPM
    uint32 private constant MAX_PPM = 1000000;

    /* ========== STATE VARIABLES ========== */

    ICreditFeeManager public creditFeeManager;
    INetworkRoles public networkRoles;
    IERC20Upgradeable public feeToken;
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
        feeToken = IERC20Upgradeable(creditFeeManager.getCollateralToken());
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

    function collectFees(address _member, uint256 _transactionAmount)
        external
        override
        onlyNetwork
    {
        uint256 totalFee = creditFeeManager.calculatePercentInCollateral(
            network,
            totalFeePercent,
            _transactionAmount
        );
        feeToken.safeTransferFrom(_member, address(this), totalFee);
        accruedFees[_member] += totalFee;
        creditFeeManager.collectFees(network, _member, _transactionAmount);
        emit FeesCollected(_member, totalFee);
    }

    function claimRewards(address[] memory _members) external {
        distributeFees(_members);
        if (networkRoles.isNetworkOperator(msg.sender)) {
            feeToken.safeTransfer(msg.sender, rewards[address(this)]);
            rewards[address(this)] = 0;
        } else {
            feeToken.safeTransfer(msg.sender, rewards[msg.sender]);
            rewards[msg.sender] = 0;
        }
        emit RewardsClaimed(msg.sender, rewards[msg.sender]);
    }

    function distributeFees(address[] memory _members) public {
        for (uint256 i = 0; i < _members.length; i++) {
            uint256 totalFees = accruedFees[_members[i]];
            if (totalFees == 0) continue;
            // distribute ambassador fees
            address ambassador = networkRoles.getMembershipAmbassador(_members[i]);
            uint256 ambassadorFee = (ambassadorFeePercent * totalFees) / MAX_PPM;
            // no ambassador for membership
            if (ambassador == address(0)) {
                rewards[address(this)] += ambassadorFee;
            } else {
                rewards[ambassador] += ambassadorFee;
            }
            emit AmbassadorRewardsUpdated(ambassador, rewards[ambassador]);
            // distribute network fees
            uint256 networkFee = ((MAX_PPM - ambassadorFeePercent) * totalFees) / MAX_PPM;
            rewards[address(this)] += networkFee;
            emit NetworkRewardsUpdated(rewards[address(this)]);
            accruedFees[_members[i]] = 0;
        }
    }

    function updateAmbassadorFeePercent(uint256 _ambassadorFeePercent) public onlyNetworkOperator {
        require(
            _ambassadorFeePercent <= MAX_PPM,
            "NetworkFeeManager: Total fee percent greater than 100"
        );
        ambassadorFeePercent = _ambassadorFeePercent;
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyNetworkOperator {
        require(tokenAddress != address(feeToken), "Cannot withdraw staking token");
        IERC20Upgradeable(tokenAddress).safeTransfer(owner(), tokenAmount);
    }

    function setNetwork(address _network) external override onlyNetworkOperator {
        network = _network;
    }

    /* ========== VIEWS ========== */

    function calculateAmbassadorRewards(address[] memory _members)
        external
        view
        returns (uint256 totalRewards)
    {
        for (uint256 i = 0; i < _members.length; i++) {
            uint256 totalFees = accruedFees[_members[i]];
            if (totalFees == 0) continue;
            totalRewards += (ambassadorFeePercent * totalFees) / MAX_PPM;
        }
    }

    function calculateNetworkRewards(address[] memory _members)
        external
        view
        returns (uint256 totalRewards)
    {
        for (uint256 i = 0; i < _members.length; i++) {
            uint256 totalFees = accruedFees[_members[i]];
            if (totalFees == 0) continue;
            totalRewards += ((MAX_PPM - ambassadorFeePercent) * totalFees) / MAX_PPM;
        }
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
