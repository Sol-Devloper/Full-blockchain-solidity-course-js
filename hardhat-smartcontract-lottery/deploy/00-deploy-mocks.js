const {developmentChains } = require("../helper-hardhat-config");
const {network} = require("hardhat");
const { ethers } = require("ethers");

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. It costs 0.25 link per request.
const GAS_PRICE_LINK = 1e9; //calulated value based on teh gas price of the chain

module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_LINK];

    if(developmentChains.includes(network.name)){
        log("Local network detected!! Deploying mocks...")
        //deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        });

        log("Mock deployed");
        log("----------------------------------")
    }
}

module.exports.tags = ["all", "mocks"];