// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interface/IPriceOracle.sol";
import "./interface/ICreditManager.sol";
import "./interface/IProtocolRoles.sol";
import "../Network/interface/ICIP36.sol";

contract CreditManager is OwnableUpgradeable, PausableUpgradeable, ICreditManager {
    /*
     *  Constants
     */
    uint32 private constant MAX_PPM = 1000000;

    /*
     *  Storage
     */
    IERC20 public collateralToken;
    IProtocolRoles public protocolRoles;
    IPriceOracle public oracle;
    address private creditRequest;
    // TODO: update this when SOURCE is staked
    uint256 public totalStakedCollateral;
    uint256 public minLTV;
    uint256 public creditLineExpiration;
    // network => member => creditline
    mapping(address => mapping(address => CreditLine)) public creditLines;
    mapping(address => uint256) public deposits;

    function initialize(address collateralTokenAddress, address _protocolRoles, address _oracle) external virtual initializer {
      collateralToken = IERC20(collateralTokenAddress);
      protocolRoles = IProtocolRoles(_protocolRoles);
      oracle = IPriceOracle(_oracle);
      _setMinLTV(200000);
      _setCreditLineExpirationDays(180 days);
      __Ownable_init();
      __Pausable_init();
    }

    function registerCreditRequest(address _creditRequest) external onlyOperator {
      creditRequest = _creditRequest;
    }

    /*
     *  Modifiers
     */
    modifier onlyOperator() {
      require(protocolRoles.isProtocolOperator(msg.sender), "CreditManager: Caller must be an operator");
      _;
    }

    modifier onlyRequest() {
      require(msg.sender == creditRequest, "CreditManager: Caller must be from CreditRequest");
      _;
    }

    modifier onlyUnderwriter(address _underwriter) {
      require(protocolRoles.isUnderwriter(_underwriter), "CreditManager: Underwriter address is not authorized");
      _;
    }

    modifier onlyRegisteredNetwork(address _network) {
      require(protocolRoles.isNetwork(_network), "CreditRequest: Network token address is not registered");
      _;
    }

    /*
     * External functions
     */
    function createCreditLine(
      address _counterparty, 
      address _underwriter, 
      uint256 _collateral,
      uint256 _creditLimit,
      address _network) external override onlyRequest onlyUnderwriter(_underwriter) onlyRegisteredNetwork(_network) {
      creditLines[_network][_counterparty] = CreditLine(
        _underwriter,
        _network,
        0,
        block.timestamp
      );
      stakeCollateral(_network, _counterparty, _underwriter, _collateral);
      ICIP36(_network).setCreditLimit(_counterparty, _creditLimit);
    }

    function depositAndStakeCollateral(address _network, address _counterparty, address _underwriter, uint256 _amount) external override {
      depositCollateral(_underwriter, _amount);
      stakeCollateral(_network, _counterparty, _underwriter, _amount);
    }

    function depositCollateral(address _underwriter, uint256 _amount) public {
      collateralToken.transferFrom(_underwriter, address(this), _amount);
      deposits[_underwriter] += _amount;
    }

    function stakeCollateral(address _network, address _counterparty, address _underwriter, uint256 _amount) public {
      require(deposits[_underwriter] >= _amount, "CreditManager: Not enough collateral deposited");
      CreditLine storage creditLine = creditLines[_network][_counterparty];
      require(creditLine.underwriter == _underwriter, "CreditManager: Invalid underwriter");
      creditLine.collateral += _amount;
      creditLine.underwriter = _underwriter;
    }

    function unstakeAndWithdrawCollateral(address _network, address _counterparty, address _underwriter, uint256 _amount) external {
      unstakeCollateral(_network, _counterparty, _underwriter, _amount);
      withdrawCollateral(_amount);
    }

    function unstakeCollateral(address _network, address _counterparty, address _underwriter, uint256 _amount) public override {
      CreditLine storage creditLine = creditLines[_network][_counterparty];
      require(creditLine.underwriter == _underwriter, "CreditManager: Invalid underwriter");
      creditLine.collateral -= _amount;
      require(isValidLTV(_network, _counterparty), "CreditManager: Invalid unstake amount");
      deposits[creditLine.underwriter] += _amount;
    }

    function withdrawCollateral(uint256 _amount) public {
      require(deposits[msg.sender] >= _amount, "CreditManager: Invalid withdraw amount");
      collateralToken.transferFrom(address(this), msg.sender, _amount);
      deposits[msg.sender] -= _amount;
    }

    function extendCreditLine(address _network, address _counterparty, address _underwriter, uint256 _collateral, uint256 _creditLimit) external override {
      CreditLine storage creditLine = creditLines[_network][_counterparty];
      uint256 neededCollateral = _collateral - creditLine.collateral;
      stakeCollateral(_network, _counterparty, _underwriter, neededCollateral);
      ICIP36(_network).setCreditLimit(_counterparty, _creditLimit);
    }


    function swapCreditLineUnderwriter(address _network, address _counterparty, address _underwriter) external override {
      CreditLine storage creditLine = creditLines[_network][_counterparty];
      unstakeCollateral(_network, _counterparty, _underwriter, creditLine.collateral);
      stakeCollateral(_network, _counterparty, _underwriter, creditLine.collateral);
    }

    function closeCreditLine(address _network, address _counterparty) external onlyUnderwriter(msg.sender) {
      require(ICIP36(_network).creditBalanceOf(_counterparty) == 0, "CreditManager: Line of Credit has outstanding balance");
      // TODO: require credit line is expired
      delete creditLines[_network][_counterparty];
      ICIP36(_network).setCreditLimit(_counterparty, 0);
    }

    function renewCreditLine(address _network, address _counterparty) external override {
      creditLines[_network][_counterparty].issueDate = block.timestamp;
    }

    /*
     * View functions
     */
    function isValidLTV(address _network, address _counterparty) public override view returns(bool) {
      uint256 LTV = calculateLTV(_network, _counterparty);
      return LTV > minLTV;
    }

    function calculateLTV(address _network, address _counterparty) public override view returns(uint256) {
      CreditLine memory creditLine = creditLines[_network][_counterparty];
      uint256 creditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);
      uint256 creditLimitInCollateral = convertNetworkToCollateral(creditLine.network, creditLimit);
      return (creditLimitInCollateral / creditLine.collateral) * MAX_PPM;
    }

    function getNeededCollateral(address _network, address _counterparty) external override view returns(uint256) {
      CreditLine memory creditLine = creditLines[_network][_counterparty];
      uint256 creditLimit = ICIP36(creditLine.network).creditLimitOf(_counterparty);
      uint256 creditLimitInCollateral = convertNetworkToCollateral(_network, creditLimit);
      uint256 minimumCollateral = (creditLimitInCollateral / minLTV) / MAX_PPM;
      return minimumCollateral - creditLine.collateral;      
    }

    function isCreditLineExpired(address _network, address _counterparty) external override view returns(bool) {
      CreditLine storage creditLine = creditLines[_network][_counterparty];
      return creditLine.issueDate + creditLineExpiration >= block.timestamp;
    }

    function getCollateralToken() external override view returns(address) {
      return address(collateralToken);
    }

    function getMinLTV() external override view returns(uint256) {
      return minLTV;
    }

    function getCreditLine(address _network, address _counterparty) public override view returns(CreditLine memory) {
      return creditLines[_network][_counterparty];
    }

    function convertNetworkToCollateral(address _network, uint256 _amount) override public view returns(uint256) {
      require (_amount > 0, "CreditRequest: Request does not exist");
      uint256 decimalConversion = IERC20Metadata(address(collateralToken)).decimals() - 
          IERC20Metadata(_network).decimals();
      return (_amount * 10**decimalConversion) / oracle.getPrice();
    }

    /*
     * Private functions
     */

    /**
     * @dev Internal: Set a collateral percentage.
     * @param _percentage Colateral percentage
     */
    function _setMinLTV(uint32 _percentage) private {
        // Must be within 0% to 100% (inclusive)
        require(_percentage <= MAX_PPM, ">percentage");
        minLTV = _percentage;
    }

    /**
     * @dev Internal: Set a credit line expiration.
     * @param _days days until credit line expiry.
     */
    function _setCreditLineExpirationDays(uint32 _days) private {
      require(_days >= 1 days, "expiration day must be greater than 0");
      creditLineExpiration = _days;
    }
}
