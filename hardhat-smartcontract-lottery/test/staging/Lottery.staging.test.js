const { assert, expect } = require("chai");
const {getNamedAccounts, deployments, ethers, network} = require("hardhat");
const {developmentChains, networkConfig} = require("../../helper-hardhat-config");

developmentChains.includes(network.name) ? describe.skip : describe("Lottery Uint Test", async function(){
    let lottery, lotteryEntranceFee, deployer;

    beforeEach(async function() {
        deployer= (await getNamedAccounts()).deployer;
        lottery = await ethers.getContract("Lottery", deployer);
        lotteryEntranceFee = await lottery.getEntranceFee();
    })

    describe("FulfillRamdomWords", function(){
        it("works with love chainlink keepers and chainlink VRF, we get a random winner", async function(){
            //enter teh lottery
            const startTimeStamp = await lottery.getLatestTimeStamp();
            const accounts = await ethers.getSigners();

            await new Promise(async (resolve, reject) => {
                // setup listener before we enter teh lottery
                // just in case the blockchain moves really fast
                lottery.once("WinnerPicked", async () => {
                    console.log("WinnerPicked event is fired");
                    resolve()
                    try{
                        const recentWinner = await lottery.getRecentWinner();
                        const lotteryState = await lottery.getLotteryState();
                        const winnerEndingBalance = await accounts[0].getBalance();
                        const endingTimestamp = await lottery.getLatestTimeStamp();

                        await expect(lottery.getPlayer(0)).to.be.reverted;
                        assert.equal(recentWinner.toString(), accounts[0].address);
                        assert.equal(lotteryState, 0);
                        assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(lotteryEntranceFee).toString());
                        assert(endingTimestamp > startTimeStamp);
                        resolve();
                    }catch (error){
                        console.log(error);
                        reject(e)
                    }
                })
                // Then entering the lottery
                await lottery.enterLottery({value: lotteryEntranceFee});
                const winnerStartingBalance = await accounts[0].getBalance();

                //and this code will not complete until our listener has finished listening!!
            })
        })
    })

})