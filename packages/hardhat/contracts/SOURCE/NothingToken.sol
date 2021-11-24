pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC20SOUL.sol";

contract NothingToken is ERC20SOUL {
    function initialize (
        uint256 initialSupply,
        address[] calldata stakableContracts) external virtual initializer {
        ERC20SOUL.initializeERC20SOUL("NotSource", "NOTHING", initialSupply, stakableContracts);
    }
}