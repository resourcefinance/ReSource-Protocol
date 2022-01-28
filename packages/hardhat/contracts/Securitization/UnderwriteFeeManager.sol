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

    /*
     *  Storage
     */
    IERC20 public collateralToken;
    IPriceOracle public priceOracle;
    ICreditManager public creditManager;
    IProtocolRoles public protocolRoles;
    ICreditRequest public creditRequest;
    uint32 public underwriterFeePercent;

    function initialize(
        address _collateralToken,
        address _priceOracle,
        address _creditManager,
        address _protocolRoles
    ) external virtual initializer {
        __Ownable_init();
        collateralToken = IERC20(_collateralToken);
        priceOracle = IPriceOracle(_priceOracle);
        creditManager = ICreditManager(_creditManager);
        protocolRoles = IProtocolRoles(_protocolRoles);
        underwriterFeePercent = 20000;
    }

    function collectFees(
        address _network,
        address _networkAccount,
        uint256 _transactionValue
    ) external override {
        address underwriter = creditManager.getCreditLine(_network, _networkAccount).underwriter;
        if (underwriter == address(0)) {
            return;
        }
        verifyCreditLineExpiration(_network, _networkAccount, _transactionValue);

        uint256 underwriterFee = calculatePercentInCollateral(
            _network,
            UNDERWRITER_PERCENT,
            _transactionValue
        );

        if (!creditManager.isValidLTV(_network, _networkAccount)) {
            moveFeesToCreditLine(_network, _networkAccount, underwriter, underwriterFee);
        } else {
            creditManager.depositCollateral(underwriter, underwriterFee);
        }
    }

    function getCollateralToken() external view override returns (address) {
        return address(collateralToken);
    }

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) public override returns (uint256) {
        uint256 collateralAmount = creditManager.convertNetworkToCollateral(_networkToken, _amount);
        return ((_percent * collateralAmount) / MAX_PPM);
    }

    function moveFeesToCreditLine(
        address _network,
        address _networkAccount,
        address _underwriter,
        uint256 _totalFee
    ) private {
        collateralToken.transferFrom(_networkAccount, _underwriter, _totalFee);
        uint256 neededCollateral = creditManager.getNeededCollateral(_network, _networkAccount);
        if (_totalFee < neededCollateral) {
            creditManager.depositAndStakeCollateral(
                _network,
                _networkAccount,
                _underwriter,
                _totalFee
            );
        } else {
            creditManager.depositAndStakeCollateral(
                _network,
                _networkAccount,
                _underwriter,
                neededCollateral
            );
            creditManager.depositCollateral(_underwriter, _totalFee - neededCollateral);
        }
    }

    function verifyCreditLineExpiration(
        address _network,
        address _networkAccount,
        uint256 _transactionValue
    ) private {
        bool creditLineExpired = creditManager.isCreditLineExpired(_network, _networkAccount);
        uint256 senderBalance = IERC20(_network).balanceOf(_networkAccount);
        bool usingCreditBalance = _transactionValue > senderBalance;

        if (usingCreditBalance && creditLineExpired) {
            require(
                !creditRequest.isUnstaking(_network, _networkAccount),
                "FeeManager: CreditLine is expired"
            );
            creditManager.renewCreditLine(_network, _networkAccount);
        }
    }
}
