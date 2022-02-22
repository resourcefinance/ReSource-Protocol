// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CIP36.sol";
import "./interface/INetworkRoles.sol";
import "./interface/INetworkFeeManager.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";
import "./interface/INetworkToken.sol";

contract RUSDV3 is CIP36, INetworkToken {
    /*
     *  Storage
     */
    INetworkRoles public networkRoles;
    INetworkFeeManager public feeManager;
    address public creditManager;

    /*
     *  Events
     */
    event BalanceUpdate(
        address sender,
        address recipient,
        uint256 senderBalance,
        uint256 senderCreditBalance,
        uint256 recipientBalance,
        uint256 recipientCreditBalance
    );

    modifier onlyAuthorized() override {
        require(
            msg.sender == creditManager ||
                msg.sender == address(networkRoles) ||
                msg.sender == owner() ||
                networkRoles.isNetworkOperator(msg.sender),
            "Unauthorized caller"
        );
        _;
    }

    modifier onlyRegistered(address _from, address _to) {
        require(networkRoles.isMember(_from), "Sender is not network member");
        require(networkRoles.isMember(_to), "Recipient is not network member");
        _;
    }

    modifier onlyNetworkOperator() {
        require(networkRoles.isNetworkOperator(msg.sender), "Caller is not network operator");
        _;
    }

    function initializeRUSD(
        address _creditManager,
        address _feeManager,
        address _networkRoles
    ) external virtual initializer {
        CIP36.initialize("rUSD", "rUSD");
        creditManager = _creditManager;
        feeManager = INetworkFeeManager(_feeManager);
        networkRoles = INetworkRoles(_networkRoles);
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
            super.creditBalanceOf(_to)
        );
    }

    function bulkTransfer(address[] memory _to, uint256[] memory _values) public {
        require(_to.length == _values.length);
        for (uint256 i = 0; i < _to.length; i++) {
            _transfer(msg.sender, _to[i], _values[i]);
        }
    }

    function getNetworkRoles() external view override returns (address) {
        return address(networkRoles);
    }
}
