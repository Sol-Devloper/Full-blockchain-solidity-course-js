const { assert, expect } = require("chai");
const {getNamedAccounts, deployments, ethers, network} = require("hardhat");
const {developmentChains, networkConfig} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) ? describe.skip : describe("Lottery Uint Test", async function(){
    let lottery, vrfCoordinatorV2Mock, lotteryEntranceFee, deployer, interval;
    const chainId = network.config.chainId;

    beforeEach(async function() {
        deployer= (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        lottery = await ethers.getContract("Lottery", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        lotteryEntranceFee = await lottery.getEntranceFee();
        interval = await lottery.getInterval();
    })

    describe("constructor", function() {
        it("initializes the lottery correctly", async function(){
            const lotteryState = await lottery.getLotteryState();
            assert.equal(lotteryState.toString(), "0");
            assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        })
    })

    describe("Enter Lottery function", function(){
        it("reverts when you dont pay enough", async function(){
            await expect(lottery.enterLottery()).to.be.reverted;
            //await lottery.enterLottery();
        })
        it("Records players when enter", async function(){
            await lottery.enterLottery({value: lotteryEntranceFee});
            const playerFromContract = await lottery.getPlayer(0);
            assert.equal(playerFromContract, deployer);
        })

        it("emits event when enter", async function(){
            await expect(lottery.enterLottery({value: lotteryEntranceFee})).to.emit(lottery, "LotteryEnter");
        })

        it("Does not allow entry when lottery calculating", async function(){
            await lottery.enterLottery({value: lotteryEntranceFee});
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            //we pretend to be a chainlink keeper
            await lottery.performUpkeep([]);
            await expect(lottery.enterLottery({value: lotteryEntranceFee})).to.be.reverted;
        })
    })

    describe("Checkupkeep", function(){
        it('returns false if people have not sent any ETH', async function(){
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const {upkeepNeeded} = await lottery.callStatic.checkUpkeep([]);
            assert(!upkeepNeeded);
        })
        it('returns false if lottery is not open', async function(){
            await lottery.enterLottery({value: lotteryEntranceFee});
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            await lottery.performUpkeep([]);
            const lotteryState = await lottery.getLotteryState();
            const {upkeepNeeded} = await lottery.callStatic.checkUpkeep([]);
            assert.equal(lotteryState.toString(), "1");
            assert.equal(upkeepNeeded,false);
        })
        it("returns false if enough time hasn't passed", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]); // use a higher number here if this test fails
            await network.provider.send("evm_mine", []);
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x"); // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
            assert(!upkeepNeeded);
        })
        it("returns true if enough time has passed, has players, eth, and is open", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x"); // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
            assert(upkeepNeeded);
        })
    })

    describe("performUpkeep", function(){
        it("It can only run if checkupKeep is true", async function(){
            await lottery.enterLottery({value: lotteryEntranceFee});
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const tx = await lottery.performUpkeep([]);
            assert(tx);
        })
        it("reverts when checkupkeep is false", async function() {
            await expect(lottery.performUpkeep([])).to.be.reverted;
        })
        it("updates the lottery state, emits, events, and calls teh vrf coordinator", async function(){
            await lottery.enterLottery({value: lotteryEntranceFee});
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const txResponse = await lottery.performUpkeep([]);
            const txReceipt = await txResponse.wait(1);
            const requestId = txReceipt.events[1].args.requestId;
            const lotteryState = await lottery.getLotteryState();
            assert(requestId.toNumber() > 0);
            assert(lotteryState.toString() == '1');
        })
    })
    describe("fulfillRandomWords", function(){
        beforeEach(async function(){
            await lottery.enterLottery({value: lotteryEntranceFee} );
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
        })
        it("can only be called after performUpkeep", async function(){
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, lottery.address)).to.be.reverted;
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, lottery.address)).to.be.reverted;
        })

        it("Picks a winner, resets the lottery, and send money", async function(){
            const additionalEntrants = 3;
            const startingAccountIndex = 1; //deployer = 0
            const accounts = await ethers.getSigners();
            for( let i = startingAccountIndex; i < startingAccountIndex + additionalEntrants; i++){
                const accountConnectedLottery = lottery.connect(accounts[i]);
                await accountConnectedLottery.enterLottery({value: lotteryEntranceFee});
            }
            const startingTimeStamp = await lottery.getLatestTimeStamp();

            //performupkeep (mock being chainlink keepers)
            //fulfillRandomwords (mock being the chainlink VRF)
            //we will have to wait for the fulfillRandomWords to be called
            await new Promise(async (resolve, reject) => {
                lottery.once("WinnerPicked", async () => {
                    console.log("Found the event!!");
                    try{
                        const recentWinner = await lottery.getRecentWinner();
                        const lotteryState = await lottery.getLotteryState();
                        const endingTimestamp = await lottery.getLatestTimeStamp();
                        const numPlayers = await lottery.getNumberOfPlayers();
                        const winnerEndingBalance = await accounts[1].getBalance();
                        //console.log(`Winner balance before: ${winnerEndingBalance}`);
                        assert.equal(numPlayers.toString(), "0");
                        assert.equal(lotteryState.toString(), "0");
                        assert(endingTimestamp > startingTimeStamp);

                        assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(lotteryEntranceFee.mul(additionalEntrants).add(lotteryEntranceFee).toString()));

                    } catch(e) {
                            reject(e)
                    }
                    resolve();
                })
                // Setting up the listener
                //below, we will fire teh event, and the listener will pick it up, and reolve
                const tx = await lottery.performUpkeep([]);
                const txReceipt = await tx.wait(1);
                const winnerStartingBalance = await accounts[1].getBalance();
                //console.log(`Winner balance after: ${winnerStartingBalance}`);
                await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, lottery.address)
            })
        })
    })
}) 