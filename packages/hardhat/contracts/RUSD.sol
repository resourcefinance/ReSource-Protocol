// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CIP36.sol";
import "./NetworkRegistry.sol";
import "./UnderwriteManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract RUSD is CIP36 {
    /*
     *  REGISTERED: _to and _from must be registered wallets.
     *  POSITIVE: _from must have a positive balance if _to is not a registered wallet.
     *  NONE: no restrictions to _to and _from
     */
    enum Restriction { REGISTERED, POSITIVE, NONE }

    /*
     *  Events
     */
    event RestrictionUpdated(Restriction indexed state);
    event RestrictionExpirationUpdated(uint256 restrictionRenewal);
    event BalanceUpdate(
        address sender, 
        address recipient, 
        uint256 senderBalance, 
        uint256 senderCreditBalance, 
        uint256 recipientBalance, 
        uint256 recipientCreditBalance);



    /*
     *  Storage
     */
    NetworkRegistry public registry;
    UnderwriteManager public underwriteManager;

    Restriction public restrictionState;
    uint256 restrictionRenewal;
    uint256 expirationSeconds;

    function initializeRUSD(
        address registryAddress,
        uint256 _expiration,
        address underwriteManagerAddress
    ) external virtual initializer {
        registry = NetworkRegistry(registryAddress);
        underwriteManager = UnderwriteManager(underwriteManagerAddress);
        CIP36.initialize("rUSD", "rUSD", address(underwriteManager));
        restrictionState = Restriction.REGISTERED;
        restrictionRenewal = block.timestamp;
        expirationSeconds = _expiration;
    }

    /*
     *  Overrides
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        _verifyNetworkRegistry(_from, _to, _amount);
        super._transfer(_from, _to, _amount);
        underwriteManager.updateReward(_from, _amount);
        emit BalanceUpdate(
            _from,
            _to, 
            balanceOf(_from), 
            super.creditBalanceOf(_from),
            balanceOf(_to),
            super.creditBalanceOf(_to));
    }

    function bulkTransfer(address[] memory _to, uint256[] memory _values) public  
    {
        require(_to.length == _values.length);
        for (uint256 i = 0; i < _to.length; i++) {
            super._transfer(msg.sender, _to[i], _values[i]);
        }
    }

    function _verifyNetworkRegistry(
        address _from,
        address _to,
        uint256 _amount
    ) private view {
        if (restrictionState == Restriction.NONE) {
            return;
        }
        if (restrictionState == Restriction.REGISTERED) {
            require(registry.isMember(_from), "Sender is not network member");
            require(registry.isMember(_to), "Recipient is not network member");
        }
        // if in positive restriction state, recipient is not in the registry and the sender's balance is negative
        if (restrictionState == Restriction.POSITIVE && !registry.isMember(_to)) {
            uint256 _balanceFrom = super.balanceOf(_from);
            require(_balanceFrom - _amount >= 0, "Insufficient balance for non network member");
        }
    }

    function restrictRegistered() external onlyOwner() {
        if (restrictionState == Restriction.REGISTERED || restrictionState == Restriction.NONE) {
            return;
        }
        emit RestrictionUpdated(Restriction.REGISTERED);
        restrictionState = Restriction.REGISTERED;
    }

    function restrictPositiveBalance() external onlyOwner() {
        if (restrictionState == Restriction.POSITIVE || restrictionState == Restriction.NONE) {
            return;
        }
        emit RestrictionUpdated(Restriction.POSITIVE);
        restrictionState = Restriction.POSITIVE;
    }

    function removeRestrictions() external {
        if (restrictionState == Restriction.NONE) {
            revert("Already non restrictive");
        }
        if ((block.timestamp - restrictionRenewal) < expirationSeconds) {
            revert("Restriction state not expired...");
        }
        emit RestrictionUpdated(Restriction.NONE);
        restrictionState = Restriction.NONE;
    }

    function updateRestrictionExpiration() external onlyOwner() {
        emit RestrictionExpirationUpdated(block.timestamp);
        restrictionRenewal = block.timestamp;
    }
}
