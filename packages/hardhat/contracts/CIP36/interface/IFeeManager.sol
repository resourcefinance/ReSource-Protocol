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
  /// @notice This function is called by a CIP36 on transfer. It will 
  /// transfer the appropriate fee tokens from the provided networkAccount.
  /// @dev Explain to a developer any extra details
  /// @param networkAccount the account paying the transaction fees.
  /// @param _tokens the amount of CIP36 tokens transfered. 
  function accrueFees(address networkAccount, uint256 _tokens) external;

  /// @notice This function is called by a network role assigned address
  /// to claim a portion of a network account's fees.
  /// @dev The caller of this function must be a assigned a role.
  /// @param networkAccount the address of the account 
  /// @param role the role of the caller address
  function claimFees(address networkAccount, bytes32 role) external;

  /// @notice This function returns the relevant amount of tokens for a 
  /// given fee stakeholder.
  /// @param claimer the address of the fee stakeholder
  /// @param networkAccount the address of the networkAccount accruing fees 
  function getFeeClaim(address claimer, address networkAccount) external returns(uint256);
}