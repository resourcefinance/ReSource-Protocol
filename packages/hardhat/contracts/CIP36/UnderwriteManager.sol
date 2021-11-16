pragma solidity ^0.8.0;

import "./CIP36.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract UnderwriteManager is OwnableUpgradeable {
    /*
     *  Constants
     */
    uint256 public constant MU_PRICE_DENOMINATOR_USD = 5;
    uint256 public constant LEVERAGE_DENOMINATOR = 5;
    uint256 public constant MWEI = 1000000000000;
    uint256 public constant REWARD_PERCENT = 2;
    uint256 public constant CREDIT_RENEWAL = 180 days;
    uint256 public constant MINIMUM_COLLATERAL = 600 ether;

    /*
     *  Storage
     */
    IERC20 public collateralToken;

    // underwriter => underwritee => credit line
    mapping(address => mapping(address => CreditLine)) public creditLines;
    mapping(address => bool) private networks;
    mapping(address => address) public underwriters;
    bool public isActive;
    uint256 public totalCollateral;

    struct CreditLine {
        uint256 collateral;
        address networkToken;
        uint256 issueDate;
        uint256 reward;
    }

    struct CreditLineEvent {
        address underwriter;
        address underwritee;
        CreditLine data;
    }

    struct CreditLineLimitEvent {
        address underwriter;
        address underwritee;
        CreditLine data;
        uint256 creditLimit;
    }

    /*
     *  Events
     */
    event NewCreditLine(CreditLineLimitEvent creditLine);
    event ExtendCreditLine(
        CreditLineLimitEvent creditLine, 
        uint256 additionalCollateral
    );
    event CreditLineReward(CreditLineEvent creditLine);
    event CreditLineRewardClaimed(
        address underwriter,
        address[] underwritees,
        uint256[] rewards,
        uint256 totalClaimed
    );
    event CreditLineWithdrawal(CreditLineLimitEvent creditLine);

    function initialize(address _collateralTokenAddress) external virtual initializer {
        collateralToken = IERC20(_collateralTokenAddress);
        isActive = true;
        __Ownable_init();
    }

    /*
     *  Modifiers
     */
    modifier notNull(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    modifier onlyNetwork(address _address) {
        require(networks[_address] == true || _address == owner(), "Invalid network address");
        _;
    }

    modifier validCreditRenewal(address underwriter, address underwritee) {
        uint256 issueDate = creditLines[underwriter][underwritee].issueDate;
        require(block.timestamp - issueDate > CREDIT_RENEWAL, "Credit limit still active");
        _;
    }

    modifier newCreditLine(address underwritee) {
        require(underwriters[underwritee] == address(0), "Address already underwritten");
        _;
    }

    modifier ownedCreditLine(address underwriter, address underwritee) {
        require(underwriters[underwritee] == underwriter, "Credit line not owned");
        _;
    }

    modifier active() {
        require(isActive == true, "Manager is inactive");
        _;
    }

    /*
     * Public functions
     */
    function underwrite(
        address networkToken,
        uint256 collateralAmount,
        address underwritee
    ) newCreditLine(underwritee) active notNull(networkToken) notNull(underwritee) external {
        CreditLine storage creditLine = creditLines[msg.sender][underwritee];
        require(creditLine.collateral == 0, "Credit line already underwritten");
        require(collateralAmount >= MINIMUM_COLLATERAL, "Insufficient collateral");
        networks[networkToken] = true;
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        creditLine.collateral = collateralAmount;
        creditLine.networkToken = networkToken;
        creditLine.issueDate = block.timestamp;
        uint256 creditLimit = calculateCredit(collateralAmount);
        emit NewCreditLine(CreditLineLimitEvent(
            msg.sender, 
            underwritee, 
            CreditLine(
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            creditLimit
        ));
        CIP36(networkToken).setCreditLimit(underwritee, creditLimit); 
        totalCollateral += collateralAmount;
        underwriters[underwritee] = msg.sender;
    }

    function extendCreditLine(address underwritee, uint256 collateralAmount) external active ownedCreditLine(msg.sender, underwritee) {
        CreditLine storage creditLine = creditLines[msg.sender][underwritee];
        require(creditLine.collateral >= MINIMUM_COLLATERAL, "Credit line not underwritten");
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        creditLine.collateral += collateralAmount;
        uint256 creditLimit = calculateCredit(creditLine.collateral);
        CIP36(creditLine.networkToken).setCreditLimit(underwritee, creditLimit);
        totalCollateral += collateralAmount;
        emit ExtendCreditLine(CreditLineLimitEvent(
            msg.sender, 
            underwritee, 
            CreditLine(
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            creditLimit
        ), collateralAmount);
    }

    function withdraw(address underwritee) external validCreditRenewal(msg.sender, underwritee) notNull(underwritee) {
        CreditLine memory creditLine = creditLines[msg.sender][underwritee];
        uint256 collateral = creditLine.collateral;
        require (collateral > 0, "Can't withdraw from empty credit line");
        uint256 creditBalance = CIP36(creditLine.networkToken).creditBalanceOf(underwritee);
        uint256 offsetBalance = creditBalance * MWEI;
        uint256 total = creditLine.collateral + creditLine.reward - offsetBalance;
        require( offsetBalance > 0, "Can't withdraw from active credit line");
        CIP36(creditLine.networkToken).setCreditLimit(underwritee, 0);
        collateralToken.transfer(msg.sender, total);
        creditLines[msg.sender][underwritee] = CreditLine(0, address(0), 0, 0);
        underwriters[underwritee] = address(0);
        totalCollateral -= collateral;
        emit CreditLineWithdrawal(CreditLineLimitEvent(
            msg.sender, 
            underwritee, 
            CreditLine(
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            0
        ));
    }

    function renewCreditLine(address underwritee) external validCreditRenewal(msg.sender, underwritee) {
        CreditLine storage creditLine = creditLines[msg.sender][underwritee];
        require(underwriters[underwritee] == msg.sender, "Must be underwriter to renew credit line");
        creditLine.issueDate = block.timestamp;
    }

    function updateReward(address underwritee, uint256 txAmount) external notNull(underwritee) onlyNetwork(msg.sender) {
        address underwriter = underwriters[underwritee];
        if (underwriter == address(0)) {
            return;
        }
        CreditLine storage creditLine = creditLines[underwriter][underwritee];
        if (creditLine.collateral == 0) {
            return;
        }
        tryUpdateCreditLine(underwritee, underwriter);
        uint256 reward = calculateReward(txAmount);
        creditLine.reward += reward;
        emit CreditLineReward(CreditLineEvent(
            underwriter, 
            underwritee, 
            CreditLine(
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                reward
            )
        ));
    }

    function claimRewards(address[] memory underwritees) external {
        uint256 totalReward = 0;
        uint256[] memory rewards = new uint256[](underwritees.length);
        for (uint256 i = 0; i < underwritees.length; i++) {
            CreditLine storage creditLine = creditLines[msg.sender][underwritees[i]];
            if (creditLine.reward > 0) {
                rewards[i] = creditLine.reward;
                totalReward += creditLine.reward;
                creditLine.reward = 0;
            }
        }
        require(totalReward > 0, "No reward to claim");
        require(collateralToken.balanceOf(address(this)) - totalReward > totalCollateral, "Insufficient funds in reward pool");
        collateralToken.transfer(msg.sender, totalReward);
        emit CreditLineRewardClaimed(msg.sender, underwritees, rewards, totalReward);
    }

    function toggleActive() external onlyOwner() {
        isActive = !isActive;
    }

    function addNetwork(address networkAddress) external onlyOwner() {
        networks[networkAddress] = true;
    }

    function removeNetwork(address networkAddress) external onlyOwner() {
        networks[networkAddress] = false;
    }

    // Returns calculation in mwei units
    function calculateCredit(uint256 collateralAmount) public pure returns (uint256) {
        return ((collateralAmount / MWEI) * (LEVERAGE_DENOMINATOR)) / MU_PRICE_DENOMINATOR_USD;
    }
    // Returns calculation in ether units
    function calculateCollateral(uint256 creditAmount) public pure returns (uint256) {
        return ((creditAmount * MWEI) * (LEVERAGE_DENOMINATOR)) / MU_PRICE_DENOMINATOR_USD;
    }

    /*
     * Private functions
     */
    function calculateReward(uint256 txAmount) private pure returns (uint256) {
        return (txAmount / 100) * REWARD_PERCENT * MWEI;
    }

    function tryUpdateCreditLine(address underwritee, address underwriter) private {
        if ((block.timestamp - creditLines[underwriter][underwritee].issueDate) > CREDIT_RENEWAL + 1 days) {
            creditLines[underwriter][underwritee].issueDate = block.timestamp;
        }
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns list of networks.
    /// @return List of networks.
    function isNetwork(address _address) external view returns (bool) {
        return networks[_address];
    }
}