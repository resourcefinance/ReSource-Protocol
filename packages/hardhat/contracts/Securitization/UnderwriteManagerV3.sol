// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interface/IPriceOracle.sol";
import "./interface/IUnderwriteManager.sol";
import "./interface/IProtocolRoles.sol";
import "./interface/ICreditRequest.sol";
import "../Network/interface/ICIP36.sol";


contract UnderwriteManagerV3 is OwnableUpgradeable, PausableUpgradeable, IUnderwriteManager {
    /*
     *  Constants
     */
    uint32 private constant MAX_PPM = 1000000;

    /*
     *  Storage
     */
    IERC20 public collateralToken;
    IProtocolRoles public protocolRoles;
    ICreditRequest public request;
    IPriceOracle public oracle;
    uint256 public totalCollateral;
    uint256 public minLTV;
    mapping(address => CreditLine) public creditLines;
    uint256 public creditLineExpiration;

    function initialize(address collateralTokenAddress, address _protocolRoles, address _request, address _oracle) external virtual initializer {
        collateralToken = IERC20(collateralTokenAddress);
        protocolRoles = IProtocolRoles(_protocolRoles);
        request = ICreditRequest(_request);
        oracle = IPriceOracle(_oracle);
        _setMinLTV(200000);
        _setCreditLineExpirationDays(180 days);
        __Ownable_init();
        __Pausable_init();
    }

    /*
     *  Modifiers
     */

    modifier onlyOperator() {
      require(protocolRoles.isOperator(msg.sender), "CreditRequest: Caller must be an operator");
      _;
    }

    modifier onlyRequest() {
      require(msg.sender == address(request), "CreditRequest: Caller must be an operator");
      _;
    }

    modifier onlyUnderwriter(address _underwriter) {
      require(protocolRoles.isUnderwriter(_underwriter), "CreditRequest: Underwriter address is not authorized");
      _;
    }

    modifier onlyRegisteredNetwork(address _networkToken) {
      require(protocolRoles.isNetwork(_networkToken), "CreditRequest: Network token address is not registered");
      _;
    }

    /*
     * Public functions
     */
    function createCreditLine(
      address _counterparty, 
      address _underwriter, 
      address _ambassador, 
      uint256 _collateral,
      uint256 _creditLimit,
      address _networkToken) external override onlyRequest onlyUnderwriter(_underwriter) onlyRegisteredNetwork(_networkToken) {
      collateralToken.transferFrom(msg.sender, address(this), _collateral);
      ICIP36(_networkToken).setCreditLimit(_counterparty, _creditLimit);
      creditLines[_counterparty] = CreditLine(
        _underwriter,
        _ambassador,
        _networkToken,
        _collateral,
        block.timestamp
      );
    }

    function isValidLTV(address _counterparty) external override returns(bool) {
      uint256 LTV = calculateLTV(_counterparty);
      return LTV > minLTV;
    }

    function calculateLTV(address _counterparty) public override returns(uint256) {
      CreditLine memory creditLine = creditLines[_counterparty];
      uint256 creditLimit = ICIP36(creditLine.networkToken).creditLimitOf(_counterparty);
      uint256 limitInCollateral = convertNetworkToCollateral(creditLine.networkToken, creditLimit);
      return (creditLine.collateral / limitInCollateral) * MAX_PPM;
    }

    function depositCollateral(address _counterparty, uint256 _amount) external override {
      collateralToken.transferFrom(msg.sender, address(this), _amount);
      CreditLine storage creditLine = creditLines[_counterparty];
      creditLine.collateral += _amount;
    }

    function requestUnstake(address _counterparty) external override {
      CreditLine storage creditLine = creditLines[_counterparty];
      ICreditRequest.CreditRequest memory creditRequest = request.getCreditRequest(_counterparty);
      uint256 creditLimit = ICIP36(creditLine.networkToken).creditLimitOf(_counterparty);
      if (creditRequest.creditLimit == creditLimit) {
        revert("Unstake Request already exists");
      } if (creditRequest.creditLimit > creditLimit) {
        revert("Extension Request already exists");
      } else {
        request.createRequest(
          _counterparty, 
          creditLimit, 
          creditLine.networkToken);
      }
    }

    function extendCreditLine(address _counterparty, uint256 _collateral, uint256 _creditLimit) external override {
      CreditLine storage creditLine = creditLines[_counterparty];
      uint256 neededCollateral = _collateral - creditLine.collateral;
      collateralToken.transferFrom(creditLine.underwriter, address(this), neededCollateral);
      creditLine.collateral = _collateral;
    }


    function swapCreditLine(address _counterparty, address _underwriter) external override {
      CreditLine storage creditLine = creditLines[_counterparty];
      collateralToken.transferFrom(address(this), creditLine.underwriter, creditLine.collateral);
      creditLine.underwriter = _underwriter;
      collateralToken.transferFrom(_underwriter, address(this), creditLine.collateral);
    }

    function getCollateralToken() external override returns(address) {
      return address(collateralToken);
    }
    
    function getMinLTV() external override returns(uint256) {
      return minLTV;
    }

    function getCreditLine(address _counterparty) public override returns(CreditLine memory) {
      return creditLines[_counterparty];
    }

    function convertNetworkToCollateral(address _networkToken, uint256 _amount) override public returns(uint256) {
      require (_amount > 0, "CreditRequest: Request does not exist");
      uint256 decimalConversion = IERC20Metadata(address(collateralToken)).decimals() - 
          IERC20Metadata(_networkToken).decimals();
      return (_amount * 10**decimalConversion) / oracle.getPrice();
    }

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
        require(_days <= 1 days, "expiration day must be greater than 0");
        creditLineExpiration = _days;
    }
}
