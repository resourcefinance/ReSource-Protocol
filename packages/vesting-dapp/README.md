# Token Vesting Web Application

Web application to manage token vesting through smart contracts deployed using [token-vesting-contracts](https://github.com/abdelhamidbakhta/token-vesting-contracts) repository.

## 📦 Installation

```
yarn
```

## ⚙️ Configuration

The configuration of the smart contract parameters and EVM network are specified in [src/config.js](src/config.js).

You have to provide the following values:

- `tokenVestingContractAddress`: The address of a deployed vesting contract instance
- `explorerRootURL`: The root URL of the blockchain explorer of your choice corresponding to the desired network

## ⛏️ Compiles and hot-reloads for development

```
yarn serve
```

## ‍💻 Compiles and minifies for production

```
yarn build
```

## 🌡️ Known issues

- The UI freezes and does not display anything if the selected EVM network is wrong

## 📄 License

**Vesting Contract UI** is released under the [Apache-2.0](LICENSE).
