// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProtocolRoles {
    /// @notice This function is for operators to grant UNDERWRITER role privileges
    /// @dev This function requires the caller to have OPERATOR role privileges
    /// @param _underwriter The address to grant UNDERWRITER role privileges to
    function grantUnderwriter(address _underwriter) external;

    /// @notice This function is for operators to revoke UNDERWRITER role privileges 
    /// @dev This function requires the caller to have OPERATOR role privileges
    /// @param _underwriter The address to revoke UNDERWRITER role privileges from
    function revokeUnderwriter(address _underwriter) external;

    /// @notice This function is for operators to grant NETWORK role privileges
    /// @dev This function requires the caller to have OPERATOR role privileges
    /// @param _network The address to grant NETWORK role privileges to
    function grantNetwork(address _network) external;

    /// @notice This function is for operators to revoke NETWORK role privileges 
    /// @dev This function requires the caller to have OPERATOR role privileges
    /// @param _network The address to revoke NETWORK role privileges from
    function revokeNetwork(address _network) external;
    
    /// @notice This function is used to identifiy if a given address has UNDERWRITER privileges
    /// @param _underwriter The address to identify UNDERWRITER role access
    /// @return address has UNDERWRITER role access
    function isUnderwriter(address _underwriter) external view returns(bool);
    
    /// @notice This function is used to identifiy if a given address has NETWORK privileges
    /// @param _network The address to identify NETWORK role access
    /// @return address has NETWORK role access
    function isNetwork(address _network) external view returns(bool);
    
    /// @notice This function is used to identifiy if a given address has OPERATOR privileges
    /// @param _operator The address to identify OPERATOR role access
    /// @return address has OPERATOR role access
    function isProtocolOperator(address _operator) external view returns(bool);
}
