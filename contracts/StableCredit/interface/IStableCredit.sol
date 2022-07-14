// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStableCredit {
    struct CreditLine {
        address creditPool;
        uint256 issueDate;
        bool deled;
    }

    function isAuthorized(address account) external view returns (bool);

    function getRoles() external view returns (address);

    function getCollateralToken() external view returns (address);

    function convertToCollateral(uint256 amount) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address _member) external view returns (uint256);

    event CreditLineCreated(address member, address pool, uint256 creditLimit, uint256 timestamp);

    event CreditLineLimitUpdated(address member, uint256 creditLimit);

    // event CreditLineDeled(address member);

    // event CreditLineUndeled(address member);

    event CreditLineDefault(address member);
}
