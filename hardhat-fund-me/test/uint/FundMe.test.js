const {deployments, ethers, getNamedAccounts} = require("hardhat");
const {assert, expect} = require("chai");

describe("FundMe", async function() {
    let fundMe, deployer, MockV3Aggregator;
    beforeEach(async function(){
        //deploy our fundMe contract
        //using hardhat-deploy
        // const accounts = await ethers.getSigners();
        // const accountZero = accounts[0];
        deployer = (await getNamedAccounts).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);

    })
    describe("constructor", async function() {
        it("Set the aggregator addresses correctly", async function (){
            const response = await fundMe.priceFeed();
            assert.equal(response, MockV3Aggregator.address);
        })
    })

    describe("fund", async function() {
        it("fails if you dont send enouh ETH", async function(){
            await expect(fundMe.fund()).to.be.reverted;
        })
    })
})
