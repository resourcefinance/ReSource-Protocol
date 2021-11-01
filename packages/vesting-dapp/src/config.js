const env = process.env.NODE_ENV

// TODO fill parameters values
const localHostConfig = {
  tokenVestingContractAddress: "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
  explorerRootURL: "https://testnet.bscscan.com/",
  tokenVestingContractAbi: require("./assets/abi/TokenVesting.json"),
  tokenVestingContractBytecode: require("./assets/bytecode/TokenVesting.json").bytecode,
  erc20ContractAbi: require("./assets/abi/ERC20.json"),
}

// TODO fill parameters values
const bscTesnetConfig = {
  tokenVestingContractAddress: "TBA",
  explorerRootURL: "https://goerli.etherscan.io/",
  tokenVestingContractAbi: require("./assets/abi/TokenVesting.json"),
  tokenVestingContractBytecode: require("./assets/bytecode/TokenVesting.json").bytecode,
  erc20ContractAbi: require("./assets/abi/ERC20.json"),
}

// TODO fill parameters values
const mainnetConfig = {
  tokenVestingContractAddress: "TBA",
  explorerRootURL: "https://etherscan.io/",
  tokenVestingContractAbi: require("./assets/abi/TokenVesting.json"),
  tokenVestingContractBytecode: require("./assets/bytecode/TokenVesting.json").bytecode,
  erc20ContractAbi: require("./assets/abi/ERC20.json"),
}
const defaultConfig = mainnetConfig

export let globalConfig
switch (env) {
  case "development":
    globalConfig = localHostConfig
    break
  case "preproduction":
    globalConfig = bscTesnetConfig
    break
  case "production":
    globalConfig = mainnetConfig
    break
  case undefined:
    globalConfig = defaultConfig
    break
}
