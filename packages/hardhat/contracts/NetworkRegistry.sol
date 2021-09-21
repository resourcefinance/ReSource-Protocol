// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./iKeyWallet/IiKeyWalletDeployer.sol";

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
    address[] public operators;
    address[] public members;
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
        members = _members;
        operators = _operators;
        operators.push(owner());
        walletDeployer = _walletDeployer;
        isOperator[owner()] = true;
    }

    /// @dev Allows operator to add a new member. Transaction has to be sent by an operator wallet.
    /// @param _members Addresses of new members.
    function addMembers(address[] memory _members) external onlyOperator(msg.sender) {
        for (uint256 i = 0; i < _members.length; i++) {
            require(!isMember[_members[i]] && _members[i] != address(0));
            isMember[_members[i]] = true;
            members.push(_members[i]);
        }
        emit MemberAddition(_members);
    }

    /// @dev Allows to remove a member. Transaction has to be sent by operator.
    /// @param member Address of member.
    function removeMember(address member) external onlyOperator(msg.sender) memberExists(member) {
        isMember[member] = false;
        for (uint256 i = 0; i < members.length - 1; i++)
            if (members[i] == member) {
                members[i] = members[members.length - 1];
                break;
            }
        members.pop();
        emit MemberRemoval(member);
    }

    /// @dev Allows to add a new operator. Transaction has to be sent by an operator wallet.
    /// @param operator Address of new operator.
    function addOperator(address operator)
        external
        onlyOperator(msg.sender)
        operatorDoesNotExist(operator)
        notNull(operator)
    {
        isOperator[operator] = true;
        operators.push(operator);
        emit OperatorAddition(operator);
    }

    /// @dev Allows to remove a operator. Transaction has to be sent by operator.
    /// @param operator Address of operator.
    function removeOperator(address operator) external onlyOperator(msg.sender) operatorExists(operator) {
        require(operator != owner(), "can't remove owner operator");
        isOperator[operator] = false;
        for (uint256 i = 0; i < operators.length - 1; i++)
            if (operators[i] == operator) {
                operators[i] = operators[operators.length - 1];
                break;
            }
        operators.pop();
        emit OperatorRemoval(operator);
    }

    function deployNewWallet(
        address[] memory _clients,
        address[] memory _guardians, 
        address _coSigner,
        uint256 _required) public onlyOperator(msg.sender) {
        address newWallet = IiKeyWalletDeployer(walletDeployer).deployWallet(_clients, _guardians, _coSigner, _required);
        OwnableUpgradeable(newWallet).transferOwnership(owner());
        isMember[newWallet] = true;
        members.push(newWallet);
        emit WalletDeployed(newWallet);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns list of members.
    /// @return List of member addresses.
    function getMembers() external view returns (address[] memory) {
        return members;
    }

    /// @dev Returns list of operators.
    /// @return List of operator addresses.
    function getOperators() external view returns (address[] memory) {
        return operators;
    }
}
