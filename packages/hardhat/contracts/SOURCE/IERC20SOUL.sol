pragma solidity ^0.8.0;

/// @title ERC20SOUL - An ERC20 extension that enables the transfer of
/// tokens alongside locking periods that can be applied to subsets of
/// the total transfer amount. This implementation also allows the owner
/// to specify staking contract addresses that locked addresses can 
/// interact with.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
interface IERC20SOUL {
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

    struct Lock {
        uint256 totalAmount;
        uint256 amountStaked;
        Schedule[] schedules;
    }

    struct Schedule {
        uint256 amount;
        uint256 expirationBlock;
    }

    /// @dev Creates a valid recipient lock after transfering tokens
    /// @param _to address to send tokens to
    /// @param _lock valid lock data associated with transfer
    function transferWithLock(address _to, Lock calldata _lock) external;

    // TODO: SAFE TRANSFER maybe...
}