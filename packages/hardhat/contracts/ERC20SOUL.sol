pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


/// @title ERC20SOUL - An ERC20 extension that enables the transfer of
/// tokens alongside locking periods that can be applied to subsets of
/// the total transfer amount. This implementation also allows the owner
/// to specify staking contract addresses that locked addresses can 
/// interact with.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract ERC20SOUL is ERC20Upgradeable, OwnableUpgradeable {
    /*
     *  Events
     */
    event LockedTransfer(
        Lock lock,
        address sender,
        address recipient
    );

    /*
     *  Storage
     */
    mapping (address => bool) public isStakableContract;
    mapping(address => Lock) public locks;

    struct Lock {
        uint256 amount;
        uint256 staked;
        Schedule[] schedules;
    }

    struct Schedule {
        uint256 amount;
        uint256 expiration;
    }

    /*
     *  Modifiers
     */
    modifier validLock(Lock calldata _lock) {
        uint256 totalLocked = 0;
        for (uint256 i = 0; i < _lock.schedules.length; i++) {
            totalLocked += _lock.schedules[i].amount;
        }
        require(totalLocked == _lock.amount, "Invalid Lock");
        _;
    }

    /*
     * Public functions
     */
    function initializeERC20SOUL(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address[] calldata stakableContracts
    ) public virtual initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        _mint(msg.sender, initialSupply);
        for (uint256 i = 0; i < stakableContracts.length; i++) {
            require(stakableContracts[i] != address(0), "invalid stakable contract address");
            isStakableContract[stakableContracts[i]] = true;
        }
    }

    function transferWithLock(
        address _to,
        Lock calldata _lock
    ) validLock(_lock) external {
        super._transfer(msg.sender, _to, _lock.amount);
        Lock storage lock = locks[_to];
        lock.amount += _lock.amount;
        for (uint256 i = 0; i < _lock.schedules.length; i++) {
            lock.schedules.push(Schedule(_lock.schedules[i].amount, _lock.schedules[i].expiration + block.timestamp));
        }
        emit LockedTransfer(_lock, msg.sender, _to);
    }

    function updateStakableContract(address _contract, bool isStakable) onlyOwner() external {
        isStakableContract[_contract] = isStakable;
    }

    /*
     * Internal functions
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        _verifyLock(_from, _to, _amount);
        super._transfer(_from, _to, _amount);
    }

    function _verifyLock(address _from, address _to, uint256 _amount) internal {
        if (isStakableContract[_from]) {
            Lock storage recipientLock = locks[_to];
            if (recipientLock.amount != 0 && recipientLock.staked >= _amount) {
                recipientLock.staked -= _amount;
            } else {
                recipientLock.staked = 0;
            }
            return;
        }

        Lock storage lock = locks[_from];
        if (lock.amount == 0) {
            return;
        }
        if (isStakableContract[_to]) {
            lock.staked += _amount;
            return;
        }

        uint256 unlockedAmount = 0;
        for (uint256 i = 0; i < lock.schedules.length; i++) {
            if (block.timestamp >= lock.schedules[i].expiration) {
                unlockedAmount += lock.schedules[i].amount;
            }
        }

        require(unlockedAmount + balanceOf(_from) + lock.staked - lock.amount >= _amount, "Insufficient unlocked funds");
        if (unlockedAmount == lock.amount) { 
            delete locks[_from];
        }
    }
}