// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/INetworkFeeManager.sol";
import "./interface/INetworkRoles.sol";
import "../Securitization/interface/IUnderwriteFeeManager.sol";


/// @title NetworkFeeManager - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkFeeManager is OwnableUpgradeable, INetworkFeeManager  {
  /*
   *  Constants
   */
  uint32 private constant MAX_PPM = 1000000;
  bytes32 private constant AMBASSADOR = "AMBASSADOR";
  bytes32 private constant NETWORK = "NETWORK";

  /*
   *  Storage
   */
  IUnderwriteFeeManager public underwriteFeeManager;
  INetworkRoles public networkRoles;
  IERC20 public collateralToken;
  uint256 totalFeePercent;
  bytes32[] feeShares;
  mapping(address => uint256) accruedFees; 
  mapping(address => uint256) rewards;
  mapping(bytes32 => uint256) feeSharePercent;
  mapping(bytes32 => address) feeShareAddress;
  
  function initialize(address _underwriteFeeManager, uint256 _totalFeePercent, uint256 _ambassadorFeePercent) external virtual initializer {
    __Ownable_init();
    underwriteFeeManager = IUnderwriteFeeManager(_underwriteFeeManager);
    collateralToken = IERC20(underwriteFeeManager.getCollateralToken());
    require(_ambassadorFeePercent <= MAX_PPM, "FeeManager: Total fee percent greater than 100");
    totalFeePercent = _totalFeePercent;
    feeShares.push(AMBASSADOR);
    feeShares.push(NETWORK);
    feeSharePercent[AMBASSADOR] = _ambassadorFeePercent;
    feeSharePercent[NETWORK] = MAX_PPM - _ambassadorFeePercent;
  }

  function collectFees(address _network, address _member, uint256 _transactionValue) external override {
    uint256 totalFee = underwriteFeeManager.calculatePercentInCollateral(_network, totalFeePercent, _transactionValue);
    accruedFees[_member] += totalFee;
    underwriteFeeManager.collectFees(_network, _member, _transactionValue);
  }

  function claimFees(address _member) external override {
    moveFeesToRewards(_member);
    collateralToken.transfer(msg.sender, rewards[msg.sender]);
  }

  function moveFeesToRewards(address _member) private {
    uint256 totalFees = accruedFees[_member];
    if (totalFees == 0) { return; }
    for (uint256 i = 0; i < feeShares.length; i++) {
      uint256 feeSharePercent = feeSharePercent[feeShares[i]];
      uint256 shareFee = (feeSharePercent * totalFees) / MAX_PPM;
      address shareAddress = feeShareAddress[feeShares[i]];
      if (feeShares[i] == AMBASSADOR) {
        shareAddress = networkRoles.getMemberAmbassador(_member);
      } else if (feeShares[i] == NETWORK) {
        shareAddress = address(this);
      }
      rewards[shareAddress] = shareFee;
    }
  }

  function updateFeeShare(bytes32 _feeShare, uint256 _feeSharePercent) public {
    if (_feeSharePercent > feeSharePercent[_feeShare]) {
      uint256 feeIncrease = _feeSharePercent - feeSharePercent[_feeShare];
      require(feeIncrease <= feeSharePercent[NETWORK], "FeeManager: Invalid fee percent");
      feeSharePercent[_feeShare] = _feeSharePercent;
      feeSharePercent[NETWORK] -= feeIncrease;
    } else {
      uint256 feeDecrease = feeSharePercent[_feeShare] - _feeSharePercent;
      feeSharePercent[_feeShare] = _feeSharePercent;
      feeSharePercent[NETWORK] += feeDecrease;
    }
    bool isNetworkShare = _feeShare == AMBASSADOR || _feeShare == NETWORK;
    if (isNetworkShare) {
      return;
    }
    if (_feeSharePercent == 0) { // remove custom share
      removeFeeShare(_feeShare);
    } else if (feeSharePercent[_feeShare] == 0) { // add new custom share
      require(_feeSharePercent > 0, "FeeManager: Fee perecent must be greater than 0");
      require(_feeSharePercent <= feeSharePercent[NETWORK], "FeeManager: Invalid fee percent");
      feeShares.push(_feeShare);
    }
  }

  function removeFeeShare(bytes32 _feeShare) private {
    for (uint256 i = 0; i < feeShares.length; i++) {
      if (feeShares[i] == _feeShare) {
        feeShares[i] = feeShares[feeShares.length - 1];
        break;
      }
    }
    feeShares.pop();
  }
}
