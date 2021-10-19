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

    event LockExpired(
        address owner,
        Lock lock
    );

    event LockScheduleExpired(
        address owner,
        Lock lock
    );

    /*
     *  Storage
     */
    mapping (address => bool) public isStakeableContract;
    mapping(address => Lock) public locks;

    /*
     *  Constants
     */
    uint256 public constant MINIMUM_LOCK_TIME = 60;
    uint256 public constant MAXIMUM_LOCK_TIME = 1825 days; 
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
            require(_lock.schedules[i].expirationBlock > 
                block.timestamp + MINIMUM_LOCK_TIME, "Lock schedule does not meet minimum");
            require(_lock.schedules[i].expirationBlock < 
                block.timestamp + MAXIMUM_LOCK_TIME, "Lock schedule does not meet maximum");
        }
        require(totalLocked == _lock.totalAmount, "Invalid Lock");
        _;
    }

    /*
     * Public functions
     */
    /// @dev Contract initialzer sets ERC20 token data and stakeable contracts
    /// @param name Name of ERC20 token
    /// @param symbol Symbol of ERC20 token
    /// @param initialSupply Initial supply of ERC20 token
    /// @param stakeableContracts List of valid staking contracts 
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
            require(stakeableContracts[i] != address(0), "invalid stakeable contract address");
            isStakeableContract[stakeableContracts[i]] = true;
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

    /// @dev Creates a valid recipient lock after transfering tokens
    /// @param _to address to send tokens to
    /// @param _lock valid lock data associated with transfer
    function transferWithLock(
        address _to,
        Lock calldata _lock
    ) validLock(_lock) external {
        super._transfer(msg.sender, _to, _lock.totalAmount);
        Lock storage lock = locks[_to];
        require(lock.schedules.length < MAXIMUM_SCHEDULES, "Maximum locks on address");
        lock.totalAmount += _lock.totalAmount;
        for (uint256 i = 0; i < _lock.schedules.length; i++) {
            lock.schedules.push(Schedule(_lock.schedules[i].amount, 
            _lock.schedules[i].expirationBlock));
        }
        emit LockedTransfer(_lock, msg.sender, _to);
    }

    /// @dev internal function to update relevant lock if any
    /// @param _from transaction sender
    /// @param _to transaction recipient
    /// @param _amount transaction amount
    function _updateLock(address _from, address _to, uint256 _amount) internal {
        if (updateRecipientLock(_from, _to, _amount)) { return; }
        updateSenderLock(_from, _to, _amount);
    }

    /// @dev internal function to update the sender's lock if any
    /// @param _from transaction sender
    /// @param _to transaction recipient
    /// @param sendAmount transaction amount
    function updateSenderLock(address _from, address _to, uint256 sendAmount) internal {
        Lock storage senderLock = locks[_from];

        // no lock on sender
        if (senderLock.totalAmount == 0) {
            return;
        }
        // staking tokens
        if (isStakeableContract[_to]) {
            senderLock.amountStaked += sendAmount;
            return;
        }

        uint256 amountToUnlock;
        uint256 deleteOffset;
        for (uint256 i = 0; i < senderLock.schedules.length + deleteOffset; i++) {
            uint256 index = i - deleteOffset;
            if (block.timestamp >= senderLock.schedules[index].expirationBlock) {
                amountToUnlock += senderLock.schedules[index].amount;
                senderLock.schedules[index] = senderLock.schedules[senderLock.schedules.length-1];
                senderLock.schedules.pop();
                deleteOffset++;
                emit LockScheduleExpired(_from, locks[_from]);
            }
            

        }
        uint256 availableAmount = 
            amountToUnlock + balanceOf(_from) + senderLock.amountStaked - senderLock.totalAmount;
        senderLock.totalAmount -= amountToUnlock;
        require(availableAmount >= sendAmount, "Insufficient unlocked funds");
        if (senderLock.totalAmount == 0) { 
            emit LockExpired( _from, locks[_from]);
            delete locks[_from];
        }
    }

    /// @dev internal function to update the recipient's lock if transaction is from stakeable contract
    /// @param _from transaction sender
    /// @param _to transaction recipient
    /// @param sendAmount transaction amount
    function updateRecipientLock(address _from, address _to, uint256 sendAmount) internal returns (bool) {
        if (!isStakeableContract[_from]) {
            return false;
        }

        Lock storage recipientLock = locks[_to];
        // lock does not exist
        if (recipientLock.totalAmount == 0) {
            return false;
        }
        recipientLock.amountStaked = 
        recipientLock.amountStaked >= sendAmount ? 
        recipientLock.amountStaked - sendAmount: 0;
        return true;
    }

    /// @dev external function to add a stakeable contract
    /// @param stakingContract address of the staking contract to be added
    function addStakeableContract(address stakingContract) external onlyOwner() {
        require(stakingContract != address(0), "Invalid staking address");
        isStakeableContract[stakingContract] = true;
    }

    /// @dev external function to remove a stakeable contract
    /// @param stakingContract address of the staking contract to be removed
    function removeStakeableContract(address stakingContract) external onlyOwner() {
        require(isStakeableContract[stakingContract], "Invalid staking address");
        isStakeableContract[stakingContract] = false;
    }
}