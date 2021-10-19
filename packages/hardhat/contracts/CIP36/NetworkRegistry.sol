// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../iKeyWallet/IiKeyWalletDeployer.sol";

/// @title NetworkRegistry - Allows Network Members to be added and removed by Network Operators.
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract NetworkRegistry is OwnableUpgradeable  {
    /*
     *  Events
     */
    event MemberAddition(address[] indexed member);
    event MemberRemoval(address indexed member);
    event OperatorAddition(address indexed operator);
    event OperatorRemoval(address indexed operator);
    event WalletDeployed(address newMember);

    /*
     *  Storage
     */
    mapping(address => bool) public isMember;
    mapping(address => bool) public isOperator;
    address walletDeployer;

    /*
     *  Modifiers
     */
    modifier onlyOperator(address operator) {
        require(isOperator[operator], "address is not operator");
        _;
    }

    modifier memberDoesNotExist(address member) {
        require(!isMember[member], "member already exists");
        _;
    }

    modifier memberExists(address member) {
        require(isMember[member], "member does not exist");
        _;
    }

    modifier operatorDoesNotExist(address operator) {
        require(!isOperator[operator], "operator already exists");
        _;
    }

    modifier operatorExists(address operator) {
        require(isOperator[operator], "operator does not exist");
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0), "invalid operator address");
        _;
    }

    /*
     * External functions
     */
    /// @dev Contract initialzer sets initial members and initial operators.
    /// @param _members List of initial members.
    /// @param _operators List of initial operators.
    function initialize(address[] memory _members, address[] memory _operators, address _walletDeployer) external virtual initializer {
        __Ownable_init();
        for (uint256 i = 0; i < _members.length; i++) {
            require(!isMember[_members[i]] && _members[i] != address(0));
            isMember[_members[i]] = true;
        }
        for (uint256 j = 0; j < _operators.length; j++) {
            require(!isOperator[_operators[j]] && _operators[j] != address(0));
            isOperator[_operators[j]] = true;
        }
        walletDeployer = _walletDeployer;
        isOperator[owner()] = true;
    }

    /// @dev Allows operator to add a new member. Transaction has to be sent by an operator wallet.
    /// @param _members Addresses of new members.
    function addMembers(address[] memory _members) external onlyOperator(msg.sender) {
        for (uint256 i = 0; i < _members.length; i++) {
            require(!isMember[_members[i]] && _members[i] != address(0), "invalid members");
            isMember[_members[i]] = true;
        }
        emit MemberAddition(_members);
    }

    /// @dev Allows to remove a member. Transaction has to be sent by operator.
    /// @param member Address of member.
    function removeMember(address member) external onlyOperator(msg.sender) memberExists(member) {
        isMember[member] = false;
        emit MemberRemoval(member);
    }

    /// @dev Allows to add a new operator. Transaction has to be sent by an operator wallet.
    /// @param operator Address of new operator.
    function addOperator(address operator)
        external
        onlyOwner()
        operatorDoesNotExist(operator)
        notNull(operator)
    {
        isOperator[operator] = true;
        emit OperatorAddition(operator);
    }

    /// @dev Allows to remove a operator. Transaction has to be sent by operator.
    /// @param operator Address of operator.
    function removeOperator(address operator) external onlyOwner() operatorExists(operator) {
        require(operator != owner(), "can't remove owner operator");
        isOperator[operator] = false;
        emit OperatorRemoval(operator);
    }

    /// @dev Deploys a multisigwallet and adds it to members
    /// @param clients client wallets of the multisig
    /// @param guardians guardian wallets of the multisig
    /// @param coSigner coSigner wallet of the multiSig
    /// @param required required signatures of the multiSig 
    function deployWalletToRegistry(
        address[] memory clients,
        address[] memory guardians, 
        address coSigner,
        uint256 required) public onlyOperator(msg.sender) {
        // deploy new wallet
        address newWallet = IiKeyWalletDeployer(walletDeployer).deployWallet(clients, guardians, coSigner, required);
        // transfer ownership to registry owner
        OwnableUpgradeable(newWallet).transferOwnership(owner());
        // add new wallet to registry
        isMember[newWallet] = true;
        emit WalletDeployed(newWallet);
    }
}
