pragma solidity ^0.8.0;

import "./CIP36.sol"; // Create interface for CIP36
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract UnderwriteManager is OwnableUpgradeable {
    /*
     *  Constants
     */
    uint256 public constant SOURCE_PRICE_DENOMINATOR_USD = 5;
    uint256 public constant MWEI = 1000000000000;
    
    // TODO: add these to storage and include CRUD owner
    uint256 public constant LEVERAGE_DENOMINATOR = 5;
    uint256 public constant UNDERWRITER_RENEWAL_OFFSET = 1 days;
    uint256 public constant REWARD_PERCENT = 2;
    uint256 public constant CREDIT_RENEWAL = 180 days;
    uint256 public constant MINIMUM_COLLATERAL = 600 ether;
    mapping(address => bool) public networkContracts;


    /*
     *  Storage
     */
    IERC20 public collateralToken;
    
    bool public isActive;
    uint256 public totalCollateral;
    mapping(address => CreditLine) public creditLines;
    mapping(address => bool) public underwriters;

    struct CreditLine {
        address underwriter;
        uint256 collateral;
        address networkToken;
        uint256 issueDate;
        uint256 reward;
    }
    
    struct CreditLineEvent {
        address underwriter;
        address counterparty;
        CreditLine data;
    }

    struct CreditLineLimitEvent {
        address underwriter;
        address counterparty;
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
        address[] counterparties,
        uint256[] rewards,
        uint256 totalClaimed
    );
    event CreditLineWithdrawal(CreditLineLimitEvent creditLine);

    function initialize(address collateralTokenAddress) external virtual initializer {
        collateralToken = IERC20(collateralTokenAddress);
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
        require(networkContracts[_address] == true || _address == owner(), "Invalid network address");
        _;
    }

    modifier validCreditRenewal(address underwriter, address counterparty) {
        uint256 issueDate = creditLines[counterparty].issueDate;
        require(block.timestamp - issueDate > CREDIT_RENEWAL, "Credit limit still active");
        _;
    }

    modifier newCreditLine(address counterparty) {
        require(creditLines[counterparty].underwriter == address(0), "Address already underwritten");
        _;
    }

    modifier ownedCreditLine(address underwriter, address counterparty) {
        require(creditLines[counterparty].underwriter == underwriter, "Credit line not owned");
        _;
    }

    modifier onlyUnderwriter(address underwriter) {
        require(underwriters[underwriter], "Caller is not an underwriter");
        _;
    }

    modifier active() {
        require(isActive == true, "Manager is inactive");
        _;
    }

    /*
     * Public functions
     */
    function underwriteCreditLine(
        address networkToken,
        uint256 collateralAmount,
        address counterparty
    ) 
    active 
    newCreditLine(counterparty) 
    notNull(networkToken) 
    notNull(counterparty) 
    onlyUnderwriter(msg.sender)
    external {
        CreditLine storage creditLine = creditLines[counterparty];
        require(collateralAmount >= MINIMUM_COLLATERAL, "Insufficient collateral");
        require(networkContracts[networkToken], "Invalid network token");
        // use safe transfer from openzep
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        creditLine.collateral = collateralAmount;
        creditLine.networkToken = networkToken;
        creditLine.issueDate = block.timestamp;
        uint256 creditLimit = calculateCredit(collateralAmount);
        emit NewCreditLine(CreditLineLimitEvent(
            msg.sender, 
            counterparty, 
            CreditLine(
                msg.sender,
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            creditLimit
        ));
        CIP36(networkToken).setCreditLimit(counterparty, creditLimit); 
        totalCollateral += collateralAmount;
    }

    function extendCreditLine(address counterparty, uint256 collateralAmount) 
    active 
    notNull(counterparty) 
    ownedCreditLine(msg.sender, counterparty)
    onlyUnderwriter(msg.sender)
    external {
        CreditLine storage creditLine = creditLines[counterparty];
        // use safe transfer from openzep
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        creditLine.collateral += collateralAmount;
        uint256 creditLimit = calculateCredit(creditLine.collateral);
        CIP36(creditLine.networkToken).setCreditLimit(counterparty, creditLimit);
        totalCollateral += collateralAmount;
        emit ExtendCreditLine(CreditLineLimitEvent(
            msg.sender, 
            counterparty, 
            CreditLine(
                msg.sender,
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            creditLimit
        ), collateralAmount);
    }

    function withdrawCreditLine(address counterparty) external 
        ownedCreditLine(msg.sender, counterparty)
        validCreditRenewal(msg.sender, counterparty) 
        notNull(counterparty) {

        CreditLine memory creditLine = creditLines[counterparty];
        uint256 collateral = creditLine.collateral;
        require (collateral > 0, "Can't withdraw from empty credit line");
        uint256 creditBalance = CIP36(creditLine.networkToken).creditBalanceOf(counterparty);
        uint256 offsetBalance = creditBalance * MWEI;
        uint256 total = creditLine.collateral + creditLine.reward - offsetBalance;
        require( offsetBalance > 0, "Can't withdraw from active credit line");
        CIP36(creditLine.networkToken).setCreditLimit(counterparty, 0);
        collateralToken.transfer(msg.sender, total);
        delete creditLines[counterparty];
        totalCollateral -= collateral;
        emit CreditLineWithdrawal(CreditLineLimitEvent(
            msg.sender, 
            counterparty, 
            CreditLine(
                msg.sender,
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                0
            ),
            0
        ));
    }

    function renewCreditLine(address counterparty) external 
    ownedCreditLine(msg.sender, counterparty) 
    validCreditRenewal(msg.sender, counterparty) {
        CreditLine storage creditLine = creditLines[counterparty];
        creditLine.issueDate = block.timestamp;
    }

    function tryUpdateReward(address counterparty, uint256 txAmount) external 
    notNull(counterparty) 
    onlyNetwork(msg.sender) {
        CreditLine storage creditLine = creditLines[counterparty];
        if (creditLine.collateral == 0) {
            return;
        }
        address underwriter = creditLines[counterparty].underwriter;
        tryRenewCreditLine(counterparty);
        uint256 reward = calculateReward(txAmount);
        creditLine.reward += reward;
        emit CreditLineReward(CreditLineEvent(
            underwriter, 
            counterparty, 
            CreditLine(
                msg.sender,
                creditLine.collateral, 
                creditLine.networkToken, 
                creditLine.issueDate,
                reward
            )
        ));
    }

    function claimRewards(address[] memory counterparties) onlyUnderwriter(msg.sender) external {
        uint256 totalReward;
        uint256[] memory rewards = new uint256[](counterparties.length);
        for (uint256 i = 0; i < counterparties.length; i++) {
            CreditLine storage creditLine = creditLines[counterparties[i]];
            require(creditLine.underwriter == msg.sender, "Credit line not owned");
            if (creditLine.reward == 0) {
                continue;
            }
            rewards[i] = creditLine.reward;
            totalReward += creditLine.reward;
            creditLine.reward = 0;
        }
        require(totalReward > 0, "No reward to claim");
        require(collateralToken.balanceOf(address(this)) - totalReward > totalCollateral, "Insufficient funds in reward pool");
        // use safe transfer from openzep
        collateralToken.transfer(msg.sender, totalReward);
        emit CreditLineRewardClaimed(msg.sender, counterparties, rewards, totalReward);
    }

    function activate() external onlyOwner() {
        isActive = true;
    }

    function deactivate() external onlyOwner() {
        isActive = false;
    }

    function updateUnderwriters(address[] memory _underwriters, bool[] memory isUnderwriter) external onlyOwner() {
        require(_underwriters.length == isUnderwriter.length, "Invalid update value length");
        for (uint256 i = 0; i < _underwriters.length; i++) {
            underwriters[_underwriters[i]] = isUnderwriter[i];
        }
    }

    function addNetwork(address networkAddress) external onlyOwner() {
        networkContracts[networkAddress] = true;
    }

    function removeNetwork(address networkAddress) external onlyOwner() {
        networkContracts[networkAddress] = false;
    }

    // Returns calculation in mwei units
    function calculateCredit(uint256 collateralAmount) public pure returns (uint256) {
        return ((collateralAmount / MWEI) * (LEVERAGE_DENOMINATOR)) / SOURCE_PRICE_DENOMINATOR_USD;
    }
    // Returns calculation in ether units
    function calculateCollateral(uint256 creditAmount) public pure returns (uint256) {
        return ((creditAmount * MWEI) * (LEVERAGE_DENOMINATOR)) / SOURCE_PRICE_DENOMINATOR_USD;
    }

    /*
     * Private functions
     */
    function calculateReward(uint256 txAmount) private pure returns (uint256) {
        return (txAmount / 100) * REWARD_PERCENT * MWEI;
    }

    function tryRenewCreditLine(address counterparty) private {
        if ((block.timestamp - creditLines[counterparty].issueDate) > CREDIT_RENEWAL + UNDERWRITER_RENEWAL_OFFSET) {
            creditLines[counterparty].issueDate = block.timestamp;
        }
    }
}
