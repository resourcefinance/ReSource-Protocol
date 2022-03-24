// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenPriceOracle is AccessControl, Ownable {
    address public oracle;
    uint public price;

    function initialize (address _oracle) public {
        oracle = _oracle;
    }

    function setTokenPrice(uint _price) public {
        require(msg.sender == oracle);
        price = _price;
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }
}
