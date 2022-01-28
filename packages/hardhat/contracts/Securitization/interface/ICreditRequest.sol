// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title This is the interface for the CreditRequest contract. The
/// purpose of the CreditRequest contract is to store credit line
/// requests from CIP36 network accounts. Requests are managed by
/// protocol roles.
/// @author Bridger Zoske | bridger@resourcenetwork.co
/// @notice This contract is used to store credit line requests
/// as well as provide an interface for managing requests.
/// @dev This contract is called directly by the UnderwriterManager to
/// create and update CreditLine objects
interface ICreditRequest {
    struct CreditRequest {
        bool approved;
        address ambassador;
        address network;
        uint256 creditLimit;
    }

    /// @notice Creates a new request for the given address.
    /// @dev this function initializes a new CreditRequest object with
    /// the caller as the ambassador, and approved as false
    /// @param _network: the address of the CIP36 token for the new credit line
    /// @param _counterparty: the address of the account to be underwritten
    /// @param _creditLimit: the credit limit of the refered credit line
    function createRequest(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) external;

    /// @notice This function is only callable by underwriters. It will call
    /// the relevant function within the creditManager contract to
    /// update/create the refered CreditLine
    /// @dev This function will delete the request and create/update a
    /// CreditLine object in the UnderwriterManger contract. The caller
    /// must be granted the UNDERWRITER role in the ProtocolRoles contract and
    /// the request must be in an approved state.
    /// @param _network: the address of the CIP36 token associated with the counterparty
    /// @param _counterparty: the _counterparty address of the request to be accepted
    function acceptRequest(address _network, address _counterparty) external;

    /// @notice Called by protocol operators to approve a credit request
    /// @dev This function must be called by an address granted the OPERATOR role
    /// in the ProtocolRoles contract. It will update a credit request's "approved" state
    /// to true;
    /// @param _counterparty the _counterparty address of the request to be updated
    function approveRequest(address _network, address _counterparty) external;

    /// @notice Called by protocol ambassadors to update a credit request
    /// @dev This function must be called by an address granted the AMBASSADOR or
    /// OPERATOR role in the ProtocolRoles contract. It will update a credit
    /// request's creditLimit
    /// @param _counterparty the _counterparty address of the request to be updated
    /// @param _creditLimit the new creditLimit for the request
    function updateRequestLimit(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) external;

    /// @notice Called by protocol ambassadors to delete a credit request
    /// @dev This function must be called by an address granted the AMBASSADOR or
    ///  OPERATOR role in the ProtocolRoles contract.
    /// @param _counterparty the _counterparty address of the request to be updated
    function deleteRequest(address _network, address _counterparty) external;

    /// @notice This function calculates the required amount of collateral to accept
    /// the credit request
    /// @dev this function is used within the approval function to verify the minimum amount of
    /// capital is provided. This returns a uint in the collateral token's denomination.
    /// @param _counterparty the _counterparty address of the credit request to calculate
    /// @param _network the address of the CIP36 token for the request
    /// @return minimum amount of collateral needed
    function calculateRequestCollateral(address _network, address _counterparty)
        external
        returns (uint256);

    /// @notice This function returns a credit request associated with the provided counterparty
    /// @param _counterparty the counterparty associated with a given credit request
    /// @return CreditRequest object for a given counterparty
    function getCreditRequest(address _network, address _counterparty)
        external
        view
        returns (CreditRequest memory);

    function isUnstaking(address _network, address _networkAccount) external returns (bool);
}
