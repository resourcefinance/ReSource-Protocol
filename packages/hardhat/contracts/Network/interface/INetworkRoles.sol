// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INetworkRoles {
    event MemberAdded(address member, address ambassador);

    event MembershipAmbassadorUpdated(address member, address ambassador);

    event AmbassadorAdded(address ambassador, uint256 creditAllowance);

    event AmbassadorAllowanceUpdated(address ambassador, uint256 creditAllowance);

    event AmbassadorRemoved(address ambassador);

    function isMember(address _member) external view returns (bool);

    function isAmbassador(address _ambassador) external view returns (bool);

    function getMembershipAmbassador(address _member) external view returns (address);

    function isNetworkOperator(address _operator) external view returns (bool);
}
