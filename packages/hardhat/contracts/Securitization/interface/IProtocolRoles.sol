// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProtocolRoles {
    function grantAmbassador(address _ambassador) external;

    function revokeAmbassador(address _ambassador) external;

    function grantUnderwriters(address[] memory _underwriters) external;

    function revokeUnderwriter(address _underwriter) external;

    function grantNetwork(address _network) external;

    function revokeNetwork(address _network) external;
    
    function isAmbassador(address _ambassador) external view returns(bool);
    
    function isUnderwriter(address _underwriter) external view returns(bool);
    
    function isNetwork(address _network) external view returns(bool);
    
    function isOperator(address _operator) external view returns(bool);
}
