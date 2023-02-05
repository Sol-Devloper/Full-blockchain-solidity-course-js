//import 
//function
// calling of main contract

// function deployFunc() {
//     console.log('hi');
// }

// module.exports.default = deployFunc;

// module.exports = async(hre) => {
//     const {getNamedAccounts, deployments} = hre
//     //hre.getNamedAccounts()
//     //hre.deployments
// };

const{networkConfig} = require("../helper-hardhat-config");

//same as above
module.exports = async({getNamedAccounts, deployments}) => {
    const{deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    //well what happens when we want to change chains?
    //when going for localhost or hardhat network we want to use a mock
    //To make the price feed dynamic, we could change utilise the chainId of the network to select the chains

    const ethUsdPriceFeedAddress = networkConfig[chainId]["EthUsdPriceFeed"];

    //mock contracts - is the contrcat does not exist, we deploy a minimal version for our local hosting, deploy mocks are technically deploy scripts!


    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], //put price feed address
        log: true,
    })
}