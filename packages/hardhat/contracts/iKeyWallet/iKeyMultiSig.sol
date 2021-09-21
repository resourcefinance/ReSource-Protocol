// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title Identikey compatible Multisignature wallet
/// @author Bridger Zoske - <bridger@resourcenetwork.co>
contract iKeyMultiSig is OwnableUpgradeable {
    /*
     *  Events
     */
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Submission(uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);
    event ClientAddition(address indexed client);
    event ClientRemoval(address indexed client);
    event GuardianAddition(address indexed guardian);
    event GuardianRemoval(address indexed guardian);
    event RequirementChange(uint256 required);

    /*
     *  Constants
     */
    uint256 public constant MAX_OWNER_COUNT = 50;

    /*
     *  Storage
     */
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(address => bool) public clients;
    mapping(address => bool) public guardians;
    address public coSigner;
    address[] public owners;
    uint256 public required;
    uint256 public transactionCount;

    mapping(address => uint256) public nonces;

    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
    }

    /*
     *  Modifiers
     */

    modifier isOwner(address owner) {
        require(clients[owner] || guardians[owner] || owner == coSigner);
        _;
    }
    
    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier isNotClient(address client) {
        require(!clients[client]);
        _;
    }

    modifier isNotGuardian(address guardian) {
        require(!guardians[guardian]);
        _;
    }

    modifier isClient(address client) {
        require(clients[client]);
        _;
    }

    modifier isCoSigner(address _coSigner) {
        require(_coSigner == coSigner);
        _;
    }

    modifier isNotCoSigner(address _coSigner) {
        require(_coSigner != coSigner);
        _;
    }
    
    modifier isGuardian(address guardian) {
        require(guardians[guardian]);
        _;
    }

    modifier transactionExists(uint256 transactionId) {
        require(transactions[transactionId].destination != address(0));
        _;
    }

    modifier confirmed(uint256 transactionId, address owner) {
        require(confirmations[transactionId][owner]);
        _;
    }

    modifier notConfirmed(uint256 transactionId, address owner) {
        require(!confirmations[transactionId][owner]);
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0));
        _;
    }

    modifier validRequirement(uint256 ownerCount, uint256 _required) {
        require(ownerCount <= MAX_OWNER_COUNT && _required <= ownerCount && _required != 0 && ownerCount != 0);
        _;
    }

    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        if (msg.value > 0) emit Deposit(msg.sender, msg.value);
    }

    /*
     * Public functions
     */
    /// @dev Contract initializer sets initial owners and required number of confirmations.
    /// @param _clients List of initial clients.
    /// @param _guardians List of initial guardians.
    /// @param _coSigner the coSigner of the wallet. This wallet is immutable.
    /// @param _required Number of required confirmations.
    function initialize(
        address[] memory _clients,
        address[] memory _guardians, 
        address _coSigner,
        uint256 _required) 
        external virtual initializer validRequirement(_clients.length + _guardians.length + 1, _required) {
        __Ownable_init();
        for (uint256 i = 0; i < _clients.length; i++) {
            require(!clients[_clients[i]] && _clients[i] != address(0));
            clients[_clients[i]] = true;
            owners.push(_clients[i]);
        }
        for (uint256 i = 0; i < _guardians.length; i++) {
            require(!guardians[_guardians[i]] && _guardians[i] != address(0));
            guardians[_guardians[i]] = true;
            owners.push(_guardians[i + _clients.length - 1]);
        }
        coSigner = _coSigner;
        owners.push(_coSigner);
        required = _required;
    }

    /// @dev Allows to add a new client. Transaction has to be sent by wallet.
    /// @param client Address of new client.
    function addClient(address client)
        external
        onlyWallet
        isNotClient(client)
        notNull(client)
        validRequirement(owners.length + 1, required)
    {
        clients[client] = true;
        owners.push(client);
        emit ClientAddition(client);
    }

    /// @dev Allows to add a new guardian. Transaction has to be sent by wallet.
    /// @param guardian Address of new guardian.
    function addGuardian(address guardian)
        external
        onlyWallet
        isNotGuardian(guardian)
        notNull(guardian)
        validRequirement(owners.length + 1, required)
    {
        guardians[guardian] = true;
        owners.push(guardian);
        emit GuardianAddition(guardian);
    }

    /// @dev Allows to remove a client. Transaction has to be sent by wallet.
    /// @param client Address of client.
    function removeClient(address client) external onlyWallet isClient(client) {
        clients[client] = false;
        removeOwner(client);
        emit ClientRemoval(client);
    }

    /// @dev Allows to remove a guardian. Transaction has to be sent by wallet.
    /// @param guardian Address of guardian.
    function removeGuardian(address guardian) external onlyWallet isGuardian(guardian) {
        guardians[guardian] = false;
        removeOwner(guardian);
        emit GuardianRemoval(guardian);
    }

    function removeOwner(address owner) internal {
        for (uint256 i = 0; i < owners.length - 1; i++)
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        owners.pop();
        if (required > owners.length) changeRequirement(owners.length);
    }

    /// @dev Allows to replace an client with a new client. Transaction has to be sent by wallet.
    /// @param client Address of client to be replaced.
    /// @param newClient Address of new client.
    function replaceClient(address client, address newClient)
        external
        onlyWallet
        isClient(client)
        isNotClient(newClient)
    {
        for (uint256 i = 0; i < owners.length; i++)
            if (owners[i] == client) {
                owners[i] = newClient;
                break;
            }
        clients[client] = false;
        clients[newClient] = true;
        emit ClientRemoval(client);
        emit ClientAddition(newClient);
    }

    /// @dev Allows to replace an guardian with a new guardian. Transaction has to be sent by wallet.
    /// @param guardian Address of guardian to be replaced.
    /// @param newGuardian Address of new guardian.
    function replaceGuardian(address guardian, address newGuardian)
        external
        onlyWallet
        isGuardian(guardian)
        isNotGuardian(newGuardian)
    {
        for (uint256 i = 0; i < owners.length; i++)
            if (owners[i] == guardian) {
                owners[i] = newGuardian;
                break;
            }
        guardians[guardian] = false;
        guardians[newGuardian] = true;
        emit GuardianRemoval(guardian);
        emit GuardianAddition(newGuardian);
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint256 _required) public onlyWallet validRequirement(owners.length, _required) {
        required = _required;
        emit RequirementChange(_required);
    }

    /// @dev Allows to change the coSigner owner. Transaction has to be sent by coSigner address.
    /// @param newCoSigner the address of the new coSigner.
    function replaceCoSigner(address newCoSigner) public isCoSigner(msg.sender) isNotCoSigner(newCoSigner) {
        for (uint256 i = 0; i < owners.length; i++)
            if (owners[i] == newCoSigner) {
                owners[i] = newCoSigner;
                break;
            }
        coSigner = newCoSigner;
    }

    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature`. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     */
    function recover(
        bytes32 hash,
        address expectedSigner,
        bytes memory signature
    ) internal pure {
        // Check the signature length
        if (signature.length != 65) {
            revert("ECDSA: invalid signature length");
        }

        // Divide the signature in r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;

        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        recover(hash, expectedSigner, v, r, s);
    }

    /**
     * @notice Based on OpenZeppelin Implementation.
     * @dev Overload of {ECDSA-recover-bytes32-bytes-} that receives the `v`,
     * `r` and `s` signature fields separately.
     */
    function recover(
        bytes32 hash,
        address expectedSigner,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure {
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        require(
            uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0,
            "ECDSA: invalid signature 's' value"
        );
        require(v == 27 || v == 28, "ECDSA: invalid signature 'v' value");

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        require(signer == expectedSigner, "ECDSA: invalid signature");
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from a `hash`. This
     * replicates the behavior of the
     * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign[`eth_sign`]
     * JSON-RPC method.
     *
     * See {recover}.
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function prepareSubmitTransaction(
        address destination,
        uint256 value,
        bytes memory data,
        uint256 nonce
    ) public view returns (bytes32) {
        bytes4 functionSig = bytes4(keccak256("submitTransaction(address,uint256,bytes)"));
        return keccak256(abi.encodeWithSelector(functionSig, destination, value, data, address(this), nonce));
    }

    function submitTransactionByRelay(
        address destination,
        uint256 value,
        bytes calldata data,
        bytes calldata sig,
        address signer
    ) external returns (uint256 transactionId) {
        bytes32 hash = prepareSubmitTransaction(destination, value, data, nonces[signer]++);
        recover(toEthSignedMessageHash(hash), signer, sig);
        return submitTransaction(destination, value, data, signer);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return transactionId Returns transaction ID.
    function submitTransaction(
        address destination,
        uint256 value,
        bytes memory data,
        address signer
    ) internal returns (uint256 transactionId) {
        transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId, signer);
        return transactionId;
    }

    function prepareConfirmTransaction(uint256 transactionId, uint256 nonce) public view returns (bytes32) {
        bytes4 functionSig = bytes4(keccak256("confirmTransaction(uint256)"));
        return keccak256(abi.encodeWithSelector(functionSig, transactionId, address(this), nonce));
    }

    function confirmTransactionByRelay(
        uint256 transactionId,
        bytes calldata sig,
        address signer
    ) external {
        bytes32 hash = prepareConfirmTransaction(transactionId, nonces[signer]++);
        recover(toEthSignedMessageHash(hash), signer, sig);
        confirmTransaction(transactionId, signer);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint256 transactionId, address signer)
        internal
        isOwner(signer)
        transactionExists(transactionId)
        notConfirmed(transactionId, signer)
    {
        confirmations[transactionId][signer] = true;
        emit Confirmation(signer, transactionId);
        executeTransaction(transactionId, signer);
    }

    function prepareRevokeConfirmation(uint256 transactionId, uint256 nonce) public view returns (bytes32) {
        bytes4 functionSig = bytes4(keccak256("revokeConfirmation(uint256)"));
        return keccak256(abi.encodeWithSelector(functionSig, transactionId, address(this), nonce));
    }

    function revokeConfirmationByRelay(
        uint256 transactionId,
        bytes calldata sig,
        address signer
    ) external {
        bytes32 hash = prepareRevokeConfirmation(transactionId, nonces[signer]++);
        recover(toEthSignedMessageHash(hash), signer, sig);
        revokeConfirmation(transactionId, signer);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint256 transactionId, address signer)
        internal
        isOwner(signer)
        confirmed(transactionId, signer)
        notExecuted(transactionId)
    {
        confirmations[transactionId][signer] = false;
        emit Revocation(signer, transactionId);
    }

    function prepareExecuteTransaction(uint256 transactionId, uint256 nonce) public view returns (bytes32) {
        bytes4 functionSig = bytes4(keccak256("executeTransaction(uint256)"));
        return keccak256(abi.encodeWithSelector(functionSig, transactionId, address(this), nonce));
    }

    function executeTransactionByRelay(
        uint256 transactionId,
        bytes calldata sig,
        address signer
    ) external {
        bytes32 hash = prepareExecuteTransaction(transactionId, nonces[signer]++);
        recover(toEthSignedMessageHash(hash), signer, sig);
        executeTransaction(transactionId, signer);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint256 transactionId, address signer)
        internal
        isOwner(signer)
        confirmed(transactionId, signer)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            if (external_call(txn.destination, txn.value, txn.data.length, txn.data)) emit Execution(transactionId);
            else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }

    // call has been separated into its own function in order to take advantage
    // of the Solidity's code generator to produce a loop that copies tx.data into memory.
    function external_call(
        address destination,
        uint256 value,
        uint256 dataLength,
        bytes memory data
    ) internal returns (bool) {
        bool result;
        assembly {
            let x := mload(0x40) // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
            result := call(
                gas(),
                destination,
                value,
                d,
                dataLength, // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0 // Output is ignored, therefore the output size is zero
            )
        }
        return result;
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint256 transactionId) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) count += 1;
            if (count == required) return true;
        }
        return false;
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return transactionId Returns transaction ID.
    function addTransaction(
        address destination,
        uint256 value,
        bytes memory data
    ) internal notNull(destination) returns (uint256 transactionId) {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return count Number of confirmations.
    function getConfirmationCount(uint256 transactionId) external view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) if (confirmations[transactionId][owners[i]]) count += 1;
    }

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return count Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed) external view returns (uint256 count) {
        for (uint256 i = 0; i < transactionCount; i++)
            if ((pending && !transactions[i].executed) || (executed && transactions[i].executed)) count += 1;
    }

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return _confirmations Returns array of owner addresses.
    function getConfirmations(uint256 transactionId) external view returns (address[] memory _confirmations) {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < owners.length; i++)
            if (confirmations[transactionId][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        _confirmations = new address[](count);
        for (i = 0; i < count; i++) _confirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return _transactionIds Returns array of transaction IDs.
    // function getTransactionIds(
    //     uint256 from,
    //     uint256 to,
    //     bool pending,
    //     bool executed
    // ) external view returns (uint256[] memory _transactionIds) {
    //     uint256[] memory transactionIdsTemp = new uint256[](transactionCount);
    //     uint256 count = 0;
    //     uint256 i;
    //     for (i = 0; i < transactionCount; i++)
    //         if ((pending && !transactions[i].executed) || (executed && transactions[i].executed)) {
    //             transactionIdsTemp[count] = i;
    //             count += 1;
    //         }
    //     _transactionIds = new uint256[](to - from);
    //     for (i = from; i < to; i++) _transactionIds[i - from] = transactionIdsTemp[i];
    // }
}
