require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');


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
};
