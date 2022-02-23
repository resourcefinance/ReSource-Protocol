// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IPriceOracle.sol";

contract PriceOracle is IPriceOracle {
    uint256 public price;

    constructor(uint256 _price) {
        price = _price;
    }

    function setPrice(uint256 _price) external {
        price = _price;
    }

    function getPrice() external view override returns (uint256) {
        return price;
    }
}
