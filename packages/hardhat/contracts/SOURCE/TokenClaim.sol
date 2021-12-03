// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./IERC20SOUL.sol";


/// @title TokenClaim - This contract enables the storage of
/// locked (specified by the ERC20SOUL standard) and unlocked
/// tokens by a beneficiary address. This implementation also 
/// allows the owner to revoke a given claim in the case that
/// a beneficiary does not or is unable to claim.
/// @author Bridger Zoske - bridger@resourcenetwork.co
contract TokenClaim is OwnableUpgradeable, ReentrancyGuardUpgradeable {

    struct Claim {
        uint256 unlockedAmount;
        IERC20SOUL.Lock lock;
        bool released;
    }

    // address of the ERC20 token
    IERC20SOUL private _token;
    mapping(address => Claim) public claims;
    uint256 public totalClaimable;
    
    event Released(uint256 amount);

    /**
    * @dev Reverts if the address is null.
    */
    modifier notNull(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    /**
    * @dev Reverts if the claim does not exist or has been released.
    */
    modifier onlyIfClaimNotReleased(address beneficiary) {
        require(getClaimTotal(beneficiary) != 0, "TokenClaim: Claim does not exist");
        require(claims[beneficiary].released == false, "TokenClaim: Claim has been released");
        _;
    }

    /**
     * @dev Creates a claim contract.
     * @param token_ address of the ERC20 token contract
     */
    function initialize(address token_) external virtual initializer {
        require(token_ != address(0x0));
        __Ownable_init();
        _token = IERC20SOUL(token_);
    }

    /**
    * @dev Returns the address of the ERC20 token managed by the claim contract.
    */
    function getToken()
    external
    view
    returns(address){
        return address(_token);
    }

    /**
    * @notice Creates a new claim for a beneficiary.
    * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
    * @param _unlockedAmount total unlocked amount in claim
    * @param _lock lock structure for locked tokens in claim
    */
    function addClaim(
        address _beneficiary,
        uint256 _unlockedAmount,
        IERC20SOUL.Lock calldata _lock
    )
        public
        // TODO: validLock(_lock)
        notNull(_beneficiary)
        onlyOwner{
        uint256 totalAmount = _unlockedAmount + _lock.totalAmount;
        require(
            getWithdrawableAmount() >= totalAmount,
            "TokenClaim: cannot create claim because not sufficient tokens"
        );
        require(totalAmount > 0, "TokenClaim: amount must be > 0");

        Claim storage _claim = claims[_beneficiary];

        if (getClaimTotal(_beneficiary) == 0) {
            _claim.lock = _lock;
            _claim.unlockedAmount = _unlockedAmount;
            // emit newClaimAdded
        } else {
            _claim.lock.totalAmount += _lock.totalAmount;
            for (uint256 i = 0; i < _lock.schedules.length; i++) {
                _claim.lock.schedules.push(
                    IERC20SOUL.Schedule(
                        _lock.schedules[i].amount, 
                        _lock.schedules[i].expirationBlock
                ));
            }            
            _claim.unlockedAmount += _unlockedAmount;
            // emit claimUpdated event
        }
        _claim.released = false;
        totalClaimable += totalAmount;
    }

    /**
    * @notice Revokes the claim for given beneficiary
    * @param beneficiary address of claim owner
    */
    function revoke(address beneficiary)
        public
        onlyOwner
        onlyIfClaimNotReleased(beneficiary){
        totalClaimable -= getClaimTotal(beneficiary);
        delete claims[beneficiary];
    }

    /**
    * @notice Withdraw the specified amount if possible.
    * @param amount the amount to withdraw
    */
    function withdraw(uint256 amount)
        public
        nonReentrant
        onlyOwner{
        require(getWithdrawableAmount() >= amount, "TokenClaim: not enough withdrawable funds");
        _token.transfer(owner(), amount);
    }

    /**
    * @notice claim tokens
    */
    function claim()
        public
        nonReentrant
        onlyIfClaimNotReleased(msg.sender) {
        Claim storage _claim = claims[msg.sender];
        if (_claim.unlockedAmount > 0) {
            _token.transfer(msg.sender, _claim.unlockedAmount);
        }
        uint256 totalAmount = getClaimTotal(msg.sender);
        if (_claim.lock.totalAmount > 0) {
            _token.transferWithLock(msg.sender, _claim.lock);
        }
        delete claims[msg.sender];
        _claim.released = true;
        totalClaimable -= totalAmount;
    }

    /**
    * @dev Returns the amount of tokens that can be withdrawn by the owner.
    * @return the amount of tokens
    */
    function getWithdrawableAmount()
        public
        view
        returns(uint256){
        return _token.balanceOf(address(this)) - totalClaimable;
    }

     /**
    * @dev Returns the amount of tokens that can be withdrawn by the owner.
    * @return the amount of tokens
    */
    function getClaimTotal(address beneficiary)
        public
        view
        returns(uint256){
        Claim memory _claim = claims[beneficiary];
        return _claim.unlockedAmount + _claim.lock.totalAmount;
    }

         /**
    * @dev Returns the lock schedule of a given beneficiary.
    * @return the lock schedule object of a claim
    */
    function getClaimLockSchedule(address beneficiary)
        external
        view
        returns(IERC20SOUL.Schedule[] memory){
        return claims[beneficiary].lock.schedules;
    }
}