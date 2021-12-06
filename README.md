![ReSource](https://uploads-ssl.webflow.com/6016a148b166393bb61de601/60942413b02410890b73c2b6_resource-logotype.svg)

# 🏄‍♂️ Quick Start

> install dependancies

```bash
yarn
```

> start hardhat chain

```bash
yarn chain
```

> deploy contracts to local hardhat chain

```bash
yarn deploy
```

🔏 Contract deployments are stored in `packages/hardhat/deployments/<network>/<contract_name>`

# 🏗 Run Contract Tests

```bash
yarn test
```

# 🤓 Details

> Local graph node

```bash
yarn run-graph-node
```

> if old graph node, clean graph node

```bash
yarn clean-graph-node
```

> build and deploy the subgraph

```bash
yarn graph-prepare
yarn graph-codegen
yarn graph-build
yarn graph-create-local
yarn graph-deploy-local
```

🔏 smart contracts in `packages/hardhat/contracts`

💼 Deployment scripts in `packages/hardhat/deploy`

📕 Go to our home page to learn more : https://www.resourcenetwork.co/
