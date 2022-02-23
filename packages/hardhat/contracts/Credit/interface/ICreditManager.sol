// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICreditManager {
    struct CreditLine {
        address creditPool;
        uint256 issueDate;
    }

    event CreditLineCreated(
        address network,
        address counterparty,
        address pool,
        uint256 creditLimit
    );

    event CreditPoolAdded(address pool, address underwriter);

    event CreditLineLimitUpdated(address network, address counterparty, uint256 creditLimit);

    event CreditLinePoolUpdated(address network, address counterparty, address pool);

    event CreditLineRemoved(address network, address counterparty);

    event CreditLineRenewed(address network, address counterparty, uint256 expiration);

    function createCreditLine(
        address _counterparty,
        address _pool,
        uint256 _creditLimit,
        address _network
    ) external;

    function getCollateralToken() external returns (address);

    function getMinLTV() external returns (uint256);

    function getCreditLine(address _network, address _counterparty)
        external
        returns (CreditLine memory);

    function getCreditLineUnderwriter(address _network, address _counterparty)
        external
        returns (address);

    function isPoolValidLTV(address _network, address _counterparty) external returns (bool);

    function isCreditLineExpired(address _network, address _counterparty) external returns (bool);

    function swapCreditLinePool(
        address _network,
        address _counterparty,
        address _pool
    ) external;

    function extendCreditLine(
        address _network,
        address _counterparty,
        uint256 _creditLimit
    ) external;

    function convertNetworkToCollateral(address _network, uint256 _amount)
        external
        returns (uint256);

    function renewCreditLine(address _network, address _counterparty) external;

    function getNeededCollateral(address _network, address _counterparty)
        external
        returns (uint256);

    function calculatePercentInCollateral(
        address _networkToken,
        uint256 _percent,
        uint256 _amount
    ) external returns (uint256);
}
