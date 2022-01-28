// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkRoles {
    function isMember(address _member) external view returns (bool);

    function isAmbassador(address _ambassador) external view returns (bool);

    function getMemberAmbassador(address _member) external view returns (address);

    function isNetworkOperator(address _operator) external view returns (bool);
}
