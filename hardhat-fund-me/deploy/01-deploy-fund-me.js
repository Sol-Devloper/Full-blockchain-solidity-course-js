const{networkConfig, developmentChains} = require("../helper-hardhat-config");
const{network} = require("hardhat");

//same as above
module.exports = async({getNamedAccounts, deployments}) => {
    const{deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    //well what happens when we want to change chains?
    //when going for localhost or hardhat network we want to use a mock
    //To make the price feed dynamic, we could change utilise the chainId of the network to select the chains

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]; //-- this allows to get the pricefeed when not deploying the mocks!!
    
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    //mock contracts - is the contrcat does not exist, we deploy a minimal version for our local hosting, deploy mocks are technically deploy scripts!


    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
    })

    log("-----------------------------------------------");
}

module.exports.tags = ["all", "fundme"]