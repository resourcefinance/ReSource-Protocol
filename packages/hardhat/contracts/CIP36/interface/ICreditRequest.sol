pragma solidity ^0.8.0;

/// @title This is the interface for the CreditRequest contract. The
/// purpose of the CreditRequest contract is to store credit line
/// requests from network accounts. These requests are managed by a
/// contract operator address that is authorized to update requests.
/// @author Bridger Zoske | bridger@resourcenetwork.co
/// @notice This contract is used to store credit line requests 
/// as well as provide an interface for managing requests.
/// @dev This contract is called directly by the UnderwriterManager to
/// create new CreditLine objects
interface ICreditRequest {
    struct CreditRequest {
        bytes32 id;
        address ambassador;
        uint256 creditLimit;
        address network;
        bool approved;
    }

    /// @notice Creates a new request for the caller. 
    function createRequest() external;

    /// @notice This function is called by an underwriter. It will create
    /// a new CreditLine for the network account.
    /// @dev This function will delete the request and create a new 
    /// CreditLine object in the UnderwriterManger contract. The caller
    /// must be a registered Underwriter in the manager and the request
    /// in an approved state.
    /// @param requestId: the id of the request to be accepted
    function acceptRequest(bytes32 requestId) external;
    
    /// @notice Called by the contract owner to approve credit requests
    /// @dev This function must be called by the contract owner to update
    /// a credit request's state to "approved"
    /// @param requestId the id of the request to be updated
    function approveRequest(bytes32 requestId) external;

    /// @notice This function can be called by the contract owner to
    /// update a given credit request
    /// @dev this function must be called by the contract owner to update 
    /// a given credit request 
    /// @param requestId the id of the request to be updated
    /// @param _creditLimit the new creditLimit for the request
    /// @param _approved the new "approved" state of the request
    function updateRequest(bytes32 requestId, uint256 _creditLimit, bool _approved) external;

    /// @notice this function calculates the minimum amount of collateral accept the credit request
    /// @dev this function is used within the approval function to verify the minimum amount of
    /// capital is provided
    /// @param requestId the id of the credit request to calculate
    /// @return minimum amount of collateral needed
    function calculateMinRequestCollateral(bytes32 requestId) external returns(uint256);
}
