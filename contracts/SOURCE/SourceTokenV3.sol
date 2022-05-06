// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC20SOULV3.sol";

contract SourceTokenV3 is ERC20SOULV3 {
    function initialize(uint256 initialSupply, address[] calldata stakableContracts)
        external
        virtual
        initializer
    {
        ERC20SOULV3.initializeERC20SOUL("Source", "SOURCE", initialSupply, stakableContracts);
    }
}
