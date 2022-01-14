// SPDX-License-Identifier: MIT
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
        bool approved;
        address ambassador;
        address networkToken;
        uint256 creditLimit;
    }

    /// @notice Creates a new request for the given address. 
    /// @dev this function initializes a new CreditRequest object
    /// with a new id, the caller as the ambassador, and approved as false
    /// @param _counterparty: the address of the account to be underwritten
    /// @param _creditLimit: the credit limit of the new credit line
    /// @param _networkToken: the address of the CIP36 token for the new credit line
    function createRequest(address _counterparty, uint256 _creditLimit, address _networkToken) external;

    /// @notice This function is called by an underwriter. It will create
    /// a new CreditLine for the network account.
    /// @dev This function will delete the request and create a new 
    /// CreditLine object in the UnderwriterManger contract. The caller
    /// must be a registered Underwriter in the manager and the request
    /// in an approved state.
    /// @param _counterparty: the _counterparty address of the request to be accepted
    function acceptRequest(address _counterparty) external;
    
    /// @notice Called by an operator address to approve credit requests
    /// @dev This function must be called by an operator address to update
    /// a credit request's state to "approved"
    /// @param _counterparty the _counterparty address of the request to be updated
    function approveRequest(address _counterparty) external;

    /// @notice This function can be called by the request owner or an operator to
    /// update a given credit request
    /// @param _counterparty the _counterparty address of the request to be updated
    /// @param _creditLimit the new creditLimit for the request
    /// @param _approved the new "approved" state of the request
    function updateRequest(address _counterparty, uint256 _creditLimit, bool _approved) external;

    /// @notice This function can be called by the request owner or an operator to
    /// update a given credit request
    /// @dev this function must be called by the request owner or an operator to remove
    /// a given credit request 
    /// @param _counterparty the _counterparty address of the request to be removed
    function deleteRequest(address _counterparty) external;

    /// @notice this function calculates the required amount of collateral to accept the credit request
    /// @dev this function is used within the approval function to verify the minimum amount of
    /// capital is provided
    /// @param _counterparty the _counterparty address of the credit request to calculate
    /// @return minimum amount of collateral needed
    function calculateRequestCollateral(address _counterparty) external returns(uint256);

    function getCreditRequest(address _counterparty) external returns(CreditRequest memory);
}
