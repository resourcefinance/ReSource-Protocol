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
  // TODO: move underwriterFeePercent & amabassadorFee & network to roles
  struct NetworkFees {
    uint256 totalFeePercent;
    bytes32[] roles;
    mapping(bytes32 => uint256) roleFeePercent;
    mapping(bytes32 => address) roleAddress;
  }
  

  function collectFees(address _network, address _networkMember, uint256 _creditUsed) external;

  function claimFees(address _network, address _networkMember) external;

  function addNetwork(
    address _network, 
    uint256 _totalFeePercent,
    uint256 _underwriterFeePercent,
    uint256 _ambassadorFeePercent) external;

}