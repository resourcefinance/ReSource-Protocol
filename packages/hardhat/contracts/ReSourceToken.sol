pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract ReSourceToken is ERC20Upgradeable {
    function initialize(uint256 initialSupply) external virtual initializer {
        __ERC20_init("ReSource", "SOURCE");
        _mint(msg.sender, initialSupply);
    }
    //TODO: lock down transfer function to underwriterManager contract for a certain time line
}