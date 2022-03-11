// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./iKeyMultiSig.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract iKeyWalletDeployer is OwnableUpgradeable {
    function initialize() external initializer {
        __Ownable_init();
    }

    function deployWallet(
        address[] memory _clients,
        address[] memory _guardians,
        address _coSigner,
        uint256 _required
    ) public returns (address) {
        iKeyMultiSig multiSig = new iKeyMultiSig();
        multiSig.initialize(_clients, _guardians, _coSigner, _required);
        multiSig.transferOwnership(owner());
        return address(multiSig);
    }
}
