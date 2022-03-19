// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IPriceOracle.sol";

contract PriceOracle is IPriceOracle {
    uint256 public price;
    uint32 private constant MIN_PPT = 1000;

    constructor(uint256 _price) {
        price = _price;
    }

    function setPrice(uint256 _price) external {
        require(_price <= MIN_PPT, "PriceOracle: new _price must be greater than 1000");
        price = _price;
    }

    function getPriceInPPT() external view override returns (uint256) {
        return price;
    }
}
