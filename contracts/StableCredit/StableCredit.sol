// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./CIP36Upgradeable.sol";
import "./interface/INetworkRoles.sol";
import "./interface/IStableCredit.sol";
import "./interface/IFeeManager.sol";
import "./interface/IPriceOracle.sol";

contract StableCredit is CIP36Upgradeable, PausableUpgradeable, IStableCredit {
    uint32 private constant MIN_PPT = 1000;
    uint32 private constant MAX_PPM = 1000000;

    mapping(address => CreditLine) public creditLines;
    uint256 public totalCredit;

    uint256 public creditLineExpiration;
    uint256 public minLTV;

    /*
     *  Storage
     */
    INetworkRoles public networkRoles;
    IFeeManager public feeManager;
    IERC20Upgradeable public collateralToken;
    IPriceOracle public oracle;

    modifier onlyAuthorized() override {
        require(isAuthorized(msg.sender), "Unauthorized caller");
        _;
    }

    function __StableCredit_init(
        address _feeManager,
        address _collateralToken,
        address _networkRoles
    ) external virtual initializer {
        feeManager = IFeeManager(_feeManager);
        networkRoles = INetworkRoles(_networkRoles);
        collateralToken = IERC20Upgradeable(_collateralToken);
        __CIP36_init("RSD", "RSD");
        __Pausable_init();
        _pause();
    }

    /*
     *  Overrides
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override onlyMembers(_from, _to) {
        validateCreditLine(_from, _amount);
        if (!paused()) feeManager.collectFees(_from, _to, _amount);
        super._transfer(_from, _to, _amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(IStableCredit, ERC20Upgradeable) returns (bool) {
        return ERC20Upgradeable.transferFrom(from, to, amount);
    }

    function transfer(address to, uint256 amount)
        public
        override(IStableCredit, ERC20Upgradeable)
        returns (bool)
    {
        return ERC20Upgradeable.transfer(to, amount);
    }

    function balanceOf(address _member)
        public
        view
        override(IStableCredit, ERC20Upgradeable)
        returns (uint256)
    {
        return ERC20Upgradeable.balanceOf(_member);
    }

    function convertToCollateral(uint256 amount) external view override returns (uint256) {
        uint256 collateralDecimals = IERC20Metadata(address(collateralToken)).decimals();
        uint256 networkDecimals = decimals();
        if (networkDecimals < collateralDecimals) {
            uint256 delta = collateralDecimals - networkDecimals;
            return ((amount * 10**delta) / oracle.getPriceInPPT()) * MIN_PPT;
        } else {
            uint256 delta = networkDecimals - collateralDecimals;
            return ((amount / 10**delta) / oracle.getPriceInPPT()) * MIN_PPT;
        }
    }

    function validateCreditLine(address _member, uint256 _amount) internal {
        bool usingCredit = _amount > balanceOf(_member);
        CreditLine storage creditLine = creditLines[_member];
        if (creditLine.issueDate + creditLineExpiration >= block.timestamp) return;
        if (!defaultCreditLine(_member, creditLine) && usingCredit) {
            creditLine.issueDate = block.timestamp;
        }
    }

    function bulkTransfer(address[] memory _to, uint256[] memory _values) external {
        require(_to.length == _values.length, "StableCredit: invalid input");
        for (uint256 i = 0; i < _to.length; i++) {
            _transfer(msg.sender, _to[i], _values[i]);
        }
    }

    function createCreditLine(
        address _member,
        address _pool,
        uint256 _creditLimit
    ) external onlyAuthorized onlyNewCreditLine(_member) {
        if (!networkRoles.isMember(_member)) networkRoles.grantMember(_member);
        creditLines[_member] = CreditLine(_pool, block.timestamp, false);
        totalCredit += _creditLimit;
        setCreditLimit(_member, _creditLimit);
        emit CreditLineCreated(_member, _pool, _creditLimit, block.timestamp);
    }

    function extendCreditLine(address _member, uint256 _creditLimit)
        external
        onlyAuthorized
        creditLineExists(_member)
    {
        uint256 curCreditLimit = creditLimitOf(_member);
        require(curCreditLimit < _creditLimit, "StableCredit: Invalid credit limit");
        totalCredit += _creditLimit - curCreditLimit;
        setCreditLimit(_member, _creditLimit);
        emit CreditLineLimitUpdated(_member, _creditLimit);
    }

    function defaultCreditLine(address _member, CreditLine storage creditLine)
        internal
        virtual
        returns (bool)
    {
        if (!creditLine.deled) return false;
        totalCredit -= creditLimitOf(_member);
        setCreditLimit(_member, 0);
        delete creditLines[_member];
        emit CreditLineDefault(_member);
        return true;
    }

    function pauseFees() public onlyAuthorized {
        _pause();
    }

    function unpauseFees() public onlyAuthorized {
        _unpause();
    }

    function setMinLTV(uint32 _percentage) public {
        require(_percentage <= MAX_PPM, ">percentage");
        minLTV = _percentage;
    }

    function setCreditLineExpirationDays(uint32 _days) public {
        require(_days >= 1 days, "expiration day must be greater than 0");
        creditLineExpiration = _days;
    }

    function isAuthorized(address account) public view override returns (bool) {
        return networkRoles.isNetworkOperator(account) || account == owner();
    }

    function getRoles() external view override returns (address) {
        return address(networkRoles);
    }

    function getCollateralToken() external view override returns (address) {
        return address(collateralToken);
    }

    modifier onlyNewCreditLine(address _member) {
        require(
            creditLines[_member].issueDate == 0,
            "StableCredit: Credit line already exists for member"
        );
        _;
    }

    modifier creditLineExists(address _member) {
        require(
            creditLines[_member].issueDate > 0,
            "StableCredit: Credit line does not exist for member"
        );
        _;
    }

    modifier onlyMembers(address _from, address _to) {
        require(networkRoles.isMember(_from), "Sender is not network member");
        require(networkRoles.isMember(_to), "Recipient is not network member");
        _;
    }

    modifier onlyNetworkOperator() {
        require(networkRoles.isNetworkOperator(msg.sender), "Caller is not network operator");
        _;
    }
}
