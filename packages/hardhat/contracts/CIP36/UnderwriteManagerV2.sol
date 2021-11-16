pragma solidity ^0.8.0;

import "./CIP36.sol"; // Create interface for CIP36
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract UnderwriteManager is OwnableUpgradeable {
    /*
     *  Constants
     */
    uint256 public constant MWEI = 1000000000000;
    
    /*
     *  Storage
     */
    bool public isActive;
    IERC20 public collateralToken;
    uint256 public totalCollateral;
    mapping(address => CreditLine) public creditLines;
    mapping(address => bool) public underwriters;
    mapping(address => bool) public networkContracts;
    uint256 public collateralBasisPoints;
    uint256 public creditLineRenewalOffset;
    uint256 public rewardPercent;
    uint256 public creditLineExpiration;
    uint256 public minimumCollateral;
    uint256 public collateralPriceCents;


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
        collateralBasisPoints = 2000;
        collateralPriceCents = 20;
        rewardPercent = 2;
        minimumCollateral = 600 ether;
        creditLineRenewalOffset = 1 days;
        creditLineExpiration = 180 days;
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
        require(block.timestamp - issueDate > creditLineExpiration, "Credit line still active");
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
        require(collateralAmount >= minimumCollateral, "Insufficient collateral");
        require(networkContracts[networkToken], "Invalid network token");
        // use safe transfer from openzep
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        creditLine.collateral = collateralAmount;
        creditLine.networkToken = networkToken;
        creditLine.issueDate = block.timestamp;
        creditLine.underwriter = msg.sender;
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

    function updateCollateralBP(uint256 _collateralBasisPoints) external onlyOwner() {
        collateralBasisPoints = _collateralBasisPoints;
    }
    
    function updateCreditLineRenewalOffset(uint256 _creditLineRenewalOffset) external onlyOwner() {
        creditLineRenewalOffset = _creditLineRenewalOffset;
    }

    function updateRewardPercent(uint256 _rewardPercent) external onlyOwner() {
        rewardPercent = _rewardPercent;
    }

    function updateCreditLineExpiration(uint256 _creditLineExpiration) external onlyOwner() {
        creditLineExpiration = _creditLineExpiration;
    }

    function updateMinimumCollateral(uint256 _minimumCollateral) external onlyOwner() {
        minimumCollateral = _minimumCollateral;
    }

    function updateCollateralPriceCents(uint256 _collateralPriceCents) external onlyOwner() {
        collateralPriceCents = _collateralPriceCents;
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
    function calculateCredit(uint256 collateralAmount) public view returns (uint256) {
        return ((collateralAmount * collateralPriceCents * 100) / (collateralBasisPoints * MWEI));
    }
    // Returns calculation in ether units
    function calculateCollateral(uint256 creditAmount) public view returns (uint256) {
        return ((creditAmount * collateralPriceCents * 100 * MWEI) / (collateralBasisPoints));
    }

    /*
     * Private functions
     */
    function calculateReward(uint256 txAmount) private view returns (uint256) {
        return (txAmount / 100) * rewardPercent * MWEI;
    }

    function tryRenewCreditLine(address counterparty) private {
        if ((block.timestamp - creditLines[counterparty].issueDate) > creditLineExpiration + creditLineRenewalOffset) {
            creditLines[counterparty].issueDate = block.timestamp;
        }
    }
}
