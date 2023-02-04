require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");


const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "http:/" ;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key" ;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key" ;
const COIN_API_KEY = process.env.COIN_API_KEY || "key" ;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",

  //if we want to delpoy to another testnet, we will have to add the network detail in hardhat.config files like below:
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts:[`0x${PRIVATE_KEY}`],
      chainId: 5,
    }
  },
  localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
  },
  solidity: "0.8.8",

  //This is hardhat plugin, to verify the contract without doing it on etherscan.
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_API_KEY,
  }
};


//npx hardhat console --network localhost to run commands in shell