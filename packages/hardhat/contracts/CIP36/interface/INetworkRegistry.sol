pragma solidity ^0.8.0;

interface INetworkRegistry {
    function grantMemberships(address[] memory _members) external;

    function revokeMembership(address member) external;

    function grantAmbassadorships(address[] memory _ambassadors) external;

    function revokeAmbassadorship(address ambassador) external;

    function deployWalletToRegistry(
        address[] memory clients,
        address[] memory guardians, 
        address coSigner,
        uint256 required) external;

    function isMember(address _member) external view returns(bool);
    
    function isAmbassador(address _ambassador) external view returns(bool);
    
    function isOperator(address _operator) external view returns(bool);
}
