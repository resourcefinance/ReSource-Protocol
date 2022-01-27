// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IUnderwriteFeeManager.sol";
import "./interface/IPriceOracle.sol";
import "./interface/ICreditManager.sol";
import "./interface/IProtocolRoles.sol";
import "./interface/ICreditRequest.sol";

contract UnderwriteFeeManager is IUnderwriteFeeManager, OwnableUpgradeable {
  /*
   *  Constants
   */
  uint32 private constant MAX_PPM = 1000000;
  uint32 private constant UNDERWRITER_PERCENT = 20000;

  /*
   *  Storage
   */
  IERC20 public collateralToken;
  IPriceOracle public priceOracle;
  ICreditManager public creditManager;
  IProtocolRoles public protocolRoles;
  ICreditRequest public creditRequest;
  mapping(address => uint256) feeRewards;

  function initialize(
    address _collateralToken,
    address _priceOracle,
    address _creditManager, 
    address _protocolRoles) external virtual initializer {
    collateralToken = IERC20(_collateralToken);
    priceOracle = IPriceOracle(_priceOracle);
    creditManager = ICreditManager(_creditManager);
    protocolRoles = IProtocolRoles(_protocolRoles);
    __Ownable_init();
  }

  function collectFees(address _network, address _networkAccount, uint256 _transactionValue) external override {
    uint256 totalFee = calculatePercentInCollateral(_network, UNDERWRITER_PERCENT, _transactionValue);
   
    bool creditLineExpired = creditManager.isCreditLineExpired(_network, _networkAccount); 
    ICreditManager.CreditLine memory creditLine = creditManager.getCreditLine(_network, _networkAccount);
    uint256 senderBalance = IERC20(_network).balanceOf(_networkAccount);
    bool isPositiveBalance = _transactionValue > senderBalance;

    if (!creditLineExpired && isPositiveBalance) {
      feeRewards[creditLine.underwriter] += totalFee;
    } else { // credit line is expired, unstaking and using negative balance
      require(!creditRequest.isUnstaking(_network, _networkAccount), "FeeManager: CreditLine is expired");
      creditManager.renewCreditLine(_network, _networkAccount);
    }
  }

  function claimFees(address _network, address _networkMember) external override {
    // TODO: check if creditline is undercollateralized 
    collateralToken.transfer(msg.sender, feeRewards[msg.sender]);
  }

  function getCollateralToken() external view override returns(address) {
    return address(collateralToken);
  }


  function calculatePercentInCollateral(address _networkToken, uint256 _percent, uint256 _amount) public override returns(uint256) {
    uint256 collateralAmount = creditManager.convertNetworkToCollateral(_networkToken, _amount);
    return ((_percent * collateralAmount) / MAX_PPM);
  }
}