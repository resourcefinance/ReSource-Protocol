// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IPriceOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is IPriceOracle, Ownable {
    uint256 public price;
    address public oracleManager;

    constructor(uint256 _price) {
        price = _price;
    }

    function setPrice(uint256 _price) external onlyOracleManager {
        price = _price;
    }

    function getPriceInPPT() external view override returns (uint256) {
        return price;
    }

    function setOracleManager(address _oracleManager) external onlyOwner {
        oracleManager = _oracleManager;
    }

    modifier onlyOracleManager() {
        require(msg.sender == oracleManager, "PriceOracle: Caller must be manager.");
        _;
    }
}
