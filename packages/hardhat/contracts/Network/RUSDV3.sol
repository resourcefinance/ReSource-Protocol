// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CIP36.sol";
import "../Securitization/interface/IFeeManager.sol";
import "../Securitization/interface/IUnderwriteManager.sol";
import "../Securitization/interface/IProtocolRoles.sol";
import "./interface/INetworkRegistry.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RUSDV3 is CIP36 {
    /*
     *  Storage
     */
    IProtocolRoles public protocolRoles;
    INetworkRegistry public registry;
    IFeeManager public feeManager;
    IUnderwriteManager public underwriteManager;

    /*
     *  Events
     */
    event BalanceUpdate(
        address sender, 
        address recipient, 
        uint256 senderBalance, 
        uint256 senderCreditBalance, 
        uint256 recipientBalance, 
        uint256 recipientCreditBalance);

    modifier onlyAuthorized() override {
        require(msg.sender == address(underwriteManager) || msg.sender == owner() || protocolRoles.isOperator(msg.sender), "Unauthorized caller");
        _;
    }

    modifier onlyRegistered(address _from, address _to) {
        require(registry.isMember(_from), "Sender is not network member");
        require(registry.isMember(_to), "Recipient is not network member");
        _;
    }

    modifier onlyOperator() {
        require(registry.isValidOperator(msg.sender), "Caller is not network operator");
        _;
    }

    function initializeRUSD(
        address _underwriteManager,
        address _feeManager,
        address _registry,
        address _protocolRoles
    ) external virtual initializer {
        CIP36.initialize("rUSD", "rUSD");
        underwriteManager = IUnderwriteManager(_underwriteManager);
        registry = INetworkRegistry(_registry);
        protocolRoles = IProtocolRoles(_protocolRoles);
        feeManager = IFeeManager(_feeManager);
    }

    /*
     *  Overrides
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override onlyRegistered(_from, _to) {
        feeManager.collectFees(address(this), _from, _amount);
        super._transfer(_from, _to, _amount);
        
        emit BalanceUpdate(
            _from,
            _to, 
            balanceOf(_from), 
            super.creditBalanceOf(_from),
            balanceOf(_to),
            super.creditBalanceOf(_to));
    }

    function setCreditLimit(address _member, uint256 _limit) public override onlyAuthorized() {
        super.setCreditLimit(_member, _limit);
    }

    function bulkTransfer(address[] memory _to, uint256[] memory _values) public  
    {
        require(_to.length == _values.length);
        for (uint256 i = 0; i < _to.length; i++) {
            _transfer(msg.sender, _to[i], _values[i]);
        }
    }
    
    function withdrawFeeToken() onlyOperator() external {
        IERC20 token = IERC20(underwriteManager.getCollateralToken());
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}