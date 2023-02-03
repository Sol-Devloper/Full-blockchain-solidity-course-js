require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts:[`0x${PRIVATE_KEY}`],
      chainID: 5,
    }
  },
  solidity: "0.8.8",
};
