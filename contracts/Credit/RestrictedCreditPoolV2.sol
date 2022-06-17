// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "./interface/ICreditPool.sol";
import "./interface/ICreditRoles.sol";
import "./interface/ICreditManager.sol";

contract RestrictedCreditPool is
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ICreditPool
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /* ========== STATE VARIABLES ========== */

    struct Reward {
        address rewardsDistributor;
        uint256 rewardsDuration;
        uint256 periodFinish;
        uint256 rewardRate;
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
    }

    IERC20Upgradeable public stakingToken;
    ICreditRoles private creditRoles;
    mapping(address => Reward) public rewardData;
    address[] public rewardTokens;
    address public underwriter;
    uint256 public totalCredit;

    mapping(address => bool) public isRestricted;

    // user -> reward token -> amount
    mapping(address => mapping(address => uint256)) public userRewardPerTokenPaid;
    mapping(address => mapping(address => uint256)) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    /* ========== INITIALIZER ========== */

    function initialize(
        address _creditManager,
        address _creditRoles,
        address _underwriter
    ) external virtual initializer {
        __Pausable_init();
        __ReentrancyGuard_init();
        underwriter = _underwriter;
        stakingToken = IERC20Upgradeable(ICreditManager(_creditManager).getCollateralToken());
        creditRoles = ICreditRoles(_creditRoles);
    }

    function addReward(
        address _rewardsToken,
        address _rewardsDistributor,
        uint256 _rewardsDuration
    ) public onlyOwnerOrUnderwriter {
        require(
            rewardData[_rewardsToken].rewardsDuration == 0,
            "CreditPool: reward token already exists"
        );
        rewardTokens.push(_rewardsToken);
        rewardData[_rewardsToken].rewardsDistributor = _rewardsDistributor;
        rewardData[_rewardsToken].rewardsDuration = _rewardsDuration;
    }

    /* ========== VIEWS ========== */
    function viewMapping(address _rewardsToken) public view returns (Reward memory) {
        return rewardData[_rewardsToken];
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _account) external view override returns (uint256) {
        return _balances[_account];
    }

    function lastTimeRewardApplicable(address _rewardsToken) public view returns (uint256) {
        return MathUpgradeable.min(block.timestamp, rewardData[_rewardsToken].periodFinish);
    }

    function rewardPerToken(address _rewardsToken) public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardData[_rewardsToken].rewardPerTokenStored;
        }
        return
            rewardData[_rewardsToken].rewardPerTokenStored +
            (((lastTimeRewardApplicable(_rewardsToken) - rewardData[_rewardsToken].lastUpdateTime) *
                rewardData[_rewardsToken].rewardRate *
                1e18) / _totalSupply);
    }

    function earned(address account, address _rewardsToken) public view returns (uint256) {
        if (isRestricted[_rewardsToken] && isRestricted[account]) return 0;
        return (((_balances[account] *
            (rewardPerToken(_rewardsToken) - userRewardPerTokenPaid[account][_rewardsToken])) /
            1e18) + rewards[account][_rewardsToken]);
    }

    function getRewardForDuration(address _rewardsToken) external view returns (uint256) {
        return rewardData[_rewardsToken].rewardRate * rewardData[_rewardsToken].rewardsDuration;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function setRewardsDistributor(address _rewardsToken, address _rewardsDistributor)
        external
        onlyOwner
    {
        rewardData[_rewardsToken].rewardsDistributor = _rewardsDistributor;
    }

    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply + amount;
        _balances[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function stakeFor(address _staker, uint256 _amount)
        external
        override
        nonReentrant
        whenNotPaused
        updateReward(_staker)
        onlyOperator
    {
        require(_amount > 0, "CreditPool: Cannot stake 0");
        _totalSupply += _amount;
        _balances[_staker] += _amount;
        stakingToken.safeTransferFrom(_staker, address(this), _amount);
        emit Staked(_staker, _amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply -= amount;
        _balances[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        for (uint256 i; i < rewardTokens.length; i++) {
            if (isRestricted[rewardTokens[i]] && isRestricted[msg.sender]) continue;
            address _rewardsToken = rewardTokens[i];
            uint256 reward = rewards[msg.sender][_rewardsToken];
            if (reward > 0) {
                rewards[msg.sender][_rewardsToken] = 0;
                IERC20Upgradeable(_rewardsToken).safeTransfer(msg.sender, reward);
                emit RewardPaid(msg.sender, _rewardsToken, reward);
            }
        }
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(address _rewardsToken, uint256 reward)
        external
        override
        updateReward(address(0))
    {
        require(
            rewardData[_rewardsToken].rewardsDistributor == msg.sender ||
                creditRoles.isCreditOperator(msg.sender),
            "CreditPool: unauthorized caller"
        );
        // handle the transfer of reward tokens via `transferFrom` to reduce the number
        // of transactions required and ensure correctness of the reward amount
        IERC20Upgradeable(_rewardsToken).safeTransferFrom(msg.sender, address(this), reward);

        if (block.timestamp >= rewardData[_rewardsToken].periodFinish) {
            rewardData[_rewardsToken].rewardRate =
                reward /
                rewardData[_rewardsToken].rewardsDuration;
        } else {
            uint256 remaining = rewardData[_rewardsToken].periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardData[_rewardsToken].rewardRate;
            rewardData[_rewardsToken].rewardRate =
                (reward + leftover) /
                rewardData[_rewardsToken].rewardsDuration;
        }

        rewardData[_rewardsToken].lastUpdateTime = block.timestamp;
        rewardData[_rewardsToken].periodFinish =
            block.timestamp +
            rewardData[_rewardsToken].rewardsDuration;

        emit RewardAdded(reward);
    }

    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        require(tokenAddress != address(stakingToken), "Cannot withdraw staking token");
        require(rewardData[tokenAddress].lastUpdateTime == 0, "Cannot withdraw reward token");
        IERC20Upgradeable(tokenAddress).safeTransfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(address _rewardsToken, uint256 _rewardsDuration) external {
        require(
            block.timestamp > rewardData[_rewardsToken].periodFinish,
            "Reward period still active"
        );
        require(
            rewardData[_rewardsToken].rewardsDistributor == msg.sender,
            "CreditPool: caller is not rewards distributor"
        );
        require(_rewardsDuration > 0, "Reward duration must be non-zero");
        rewardData[_rewardsToken].rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(_rewardsToken, rewardData[_rewardsToken].rewardsDuration);
    }

    function updateActiveRewardsDuration(address _rewardsToken, uint256 _rewardsDuration) external {
        require(
            rewardData[_rewardsToken].rewardsDistributor == msg.sender,
            "CreditPool: caller is not rewards distributor"
        );
        require(
            block.timestamp < rewardData[_rewardsToken].periodFinish,
            "Reward period not active"
        );
        require(_rewardsDuration > 0, "Reward duration must be non-zero");

        uint256 currentDuration = rewardData[_rewardsToken].rewardsDuration;
        uint256 currentRewards = rewardData[_rewardsToken].rewardRate *
            rewardData[_rewardsToken].rewardsDuration;
        rewardData[_rewardsToken].rewardRate = currentRewards / _rewardsDuration;

        if (_rewardsDuration > currentDuration) {
            rewardData[_rewardsToken].periodFinish += _rewardsDuration - currentDuration;
        } else {
            rewardData[_rewardsToken].periodFinish -= currentDuration - _rewardsDuration;
        }

        rewardData[_rewardsToken].rewardsDuration = _rewardsDuration;

        emit RewardsDurationUpdated(_rewardsToken, rewardData[_rewardsToken].rewardsDuration);
    }

    function reduceTotalCredit(uint256 _amountToAdd) external override onlyOperator {
        totalCredit -= _amountToAdd;
    }

    function increaseTotalCredit(uint256 _amountToRemove) external override onlyOperator {
        totalCredit += _amountToRemove;
    }

    function transferUnderwriter(address _underwriter) external {
        require(
            msg.sender == underwriter || creditRoles.isCreditOperator(msg.sender),
            "CreditPool: unauthorized"
        );
        underwriter = _underwriter;
    }

    function getUnderwriter() external view override returns (address) {
        return underwriter;
    }

    function getTotalCredit() external view override returns (uint256) {
        return totalCredit;
    }

    function addRestriction(address _account) external onlyOperator {
        isRestricted[_account] = true;
    }

    function removeRestriction(address _account) external onlyOperator {
        isRestricted[_account] = false;
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        for (uint256 i; i < rewardTokens.length; i++) {
            address token = rewardTokens[i];
            rewardData[token].rewardPerTokenStored = rewardPerToken(token);
            rewardData[token].lastUpdateTime = lastTimeRewardApplicable(token);
            if (account != address(0)) {
                rewards[account][token] = earned(account, token);
                userRewardPerTokenPaid[account][token] = rewardData[token].rewardPerTokenStored;
            }
        }
        _;
    }

    modifier onlyOperator() {
        require(creditRoles.isCreditOperator(msg.sender), "CreditPool: Caller must be an operator");
        _;
    }

    modifier onlyOwnerOrUnderwriter() {
        require(
            msg.sender == owner() || creditRoles.isUnderwriter(msg.sender),
            "CreditPool: Caller must be an underwriter"
        );
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, address indexed rewardsToken, uint256 reward);
    event RewardsDurationUpdated(address token, uint256 newDuration);
    event Recovered(address token, uint256 amount);
}
