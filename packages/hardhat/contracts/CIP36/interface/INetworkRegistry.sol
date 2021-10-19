pragma solidity ^0.8.0;

interface INetworkRegistry {
    function addMembers(address[] memory _members) external;

    function removeMember(address member) external;

    function addOperator(address operator) external;

    function removeOperator(address operator) external;

    function deployWalletToRegistry(
        address[] memory clients,
        address[] memory guardians, 
        address coSigner,
        uint256 required) external;
}
