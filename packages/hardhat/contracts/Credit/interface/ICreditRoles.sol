// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditRoles {
    event UnderwriterAdded(address underwriter);

    event UnderwriterRemoved(address underwriter);

    function grantUnderwriter(address _underwriter) external;

    function revokeUnderwriter(address _underwriter) external;

    function grantNetwork(address _network) external;

    function revokeNetwork(address _network) external;

    function isUnderwriter(address _underwriter) external view returns (bool);

    function isNetwork(address _network) external view returns (bool);

    function isCreditOperator(address _operator) external view returns (bool);

    function isRequestOperator(address _operator) external returns (bool);

    function grantRequestOperator(address _requestOperator) external;

    function revokeRequestOperator(address _requestOperator) external;
}
