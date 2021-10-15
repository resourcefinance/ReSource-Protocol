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

    // TODO: add relevant events

    /*
     *  Storage
     */
    mapping (address => bool) public isStakableContract;
    mapping(address => Lock) public locks;

    /*
     *  Constants
     */
    uint256 public constant MINIMUM_LOCK_TIME = 60;
    uint256 public constant MAXIMUM_LOCK_TIME = 5 years; 
    uint256 public constant MAXIMUM_SCHEDULES = 100;

    struct Lock {
        uint256 totalAmount;
        uint256 amountStaked;
        Schedule[] schedules;
    }

    struct Schedule {
        uint256 amount;
        uint256 expirationBlock;
    }

    /*
     *  Modifiers
     */
    modifier validLock(Lock calldata _lock) {
        require(_lock.totalAmount > 0, "Invalid Lock amount");
        uint256 totalLocked;
        for (uint256 i = 0; i < _lock.schedules.length; i++) {
            totalLocked += _lock.schedules[i].amount;
            require(_lock.schedules[i].expirationBlock > block.timestamp + MINIMUM_LOCK_TIME, "Invalid Lock Schedule");
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
        address[] calldata stakeableContracts
    ) public virtual initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        _mint(msg.sender, initialSupply);
        for (uint256 i = 0; i < stakeableContracts.length; i++) {
            require(stakeableContracts[i] != address(0), "invalid stakable contract address");
            isStakableContract[stakeableContracts[i]] = true;
        }
    }

    /*
     * Internal functions
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        _updateLock(_from, _to, _amount);
        super._transfer(_from, _to, _amount);
    }

    // TODO: doc string
    function transferWithLock(
        address _to,
        Lock calldata _lock
    ) validLock(_lock) external {
        super._transfer(msg.sender, _to, _lock.totalAmount);
        Lock storage lock = locks[_to];
        lock.totalAmount += _lock.totalAmount;
        for (uint256 i = 0; i < _lock.schedules.length; i++) {
            lock.schedules.push(Schedule(_lock.schedules[i].totalAmount, _lock.schedules[i].expirationBlock));
        }
        emit LockedTransfer(_lock, msg.sender, _to);
    }

    function _updateLock(address _from, address _to, uint256 _amount) internal {
        if (updateRecipientLock(_from, _to, _amount)) {
            return;
        }

        updateSenderLock(_from, _to, _amount);
    }

    function updateSenderLock(address _from, address _to, uint256 sendAmount) internal {
        Lock storage senderLock = locks[_from];

        // lock exists
        if (senderLock.totalAmount == 0) {
            return;
        }
        // staking tokens
        if (isStakableContract[_to]) {
            lock.stakedAmount += sendAmount;
            return;
        }

        uint256 amountToUnlock;
        for (uint256 i = 0; i < lock.schedules.length; i++) {
            if (block.timestamp >= lock.schedules[i].expirationBlock) {
                amountToUnlock += lock.schedules[i].amount;
                delete lock.schedules[i];
            }
        }

        // TODO: doc string explaining this
        uint256 availableAmount = amountToUnlock + balanceOf(_from) - lock.totalAmount + lock.stakedAmount;
        require(availableAmount >= sendAmount, "Insufficient unlocked funds");
        if (amountToUnlock == lock.amount) { 
            delete locks[_from]; 
            // TODO: emit an event for deleting a lock?
        }
    }

    function updateRecipientLock(address _from, address _to, uint256 sendAmount) internal {
        if (!isStakableContract[_from]) {
            return false;
        }

        Lock storage recipientLock = locks[_to];
        // lock does not exist
        if (recipientLock.totalAmount == 0) {
            return false;
        }
        
        recipientLock.stakedAmount = 
        recipientLock.stakedAmount >= _amount ? 
        recipientLock.stakedAmount - _amount: 0;
        return true;
    }
}