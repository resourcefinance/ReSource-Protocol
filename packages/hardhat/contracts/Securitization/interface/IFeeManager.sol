// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title This is the interface for the FeeManager contract. The
/// purpose of the FeeManager contract is to store transaction fees
/// accrued by transfers of CIP36 tokens. These fees are paid in the
/// collateral token used within the underwriterManager.
/// @author Bridger Zoske | bridger@resourcenetwork.co
/// @notice This contract is used to store transaction fees for network
/// accounts, as well as provide an interface for fee shareholders to
/// access their share of fees.
/// @dev This contract is called directly by CIP36 as well as
/// the UnderwriterManager in order to manage 
interface IFeeManager {
  struct NetworkFees {
    uint256 totalFeePercent;
    bytes32[] roles;
    mapping(bytes32 => uint256) roleFeePercent;
    mapping(bytes32 => address) roleAddress;
  }

  /// @notice This function is for collecting fees from network transactions. 
  /// @dev This function is called on CIP36 transfer. If the tranfser uses credit assigned 
  /// by the UnderwriteManager contract, it will calculate and collect fees from the caller
  /// @param _network the address of the CIP36 token to collect fees from
  /// @param _networkMember the address of the network member to collect fees from
  /// @param _transactionValue the total amount used to collect fees from
  function collectFees(address _network, address _networkMember, uint256 _transactionValue) external;

  /// @notice This function is for role addresses to claim their portion of accrued fees from
  /// a network member.
  /// @dev This function is called by assigned role addresses. It will move all accrued fees
  /// to 'rewards' associated with each role address.  
  /// @param _network the address of the CIP36 token to claim fees from
  /// @param _networkMember the address of the network member to claim fees from
  function claimFees(address _network, address _networkMember) external;

  /// @notice 
  /// @dev 
  /// @param _network the address of the CIP36 token to add network fees to
  /// @param _totalFeePercent the total amount of fees each transaction will accrue
  /// @param _underwriterFeePercent the percent the underwriter role will receive from each 
  /// transaction
  /// @param _ambassadorFeePercent the percent the ambassador role will receive from each
  /// transaction
  function addNetwork(
    address _network, 
    uint256 _totalFeePercent,
    uint256 _underwriterFeePercent,
    uint256 _ambassadorFeePercent) external;

}