//lottery
//Enter the lottery (paying some account)
//Pick a random winner - complete randomness
//Winner to be selected every X mins - completly automated
//Chainlink Oracle - Randomness, Automated Execution (Chainlink Keeper);

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error Lottery_NotEnoughETHEntered();

contract Lottery is VRFConsumerBaseV2 {
    /* State variables */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    /* Evants */
    event LotteryEnter(address indexed player);

    constructor(address vrfCoordinatorV2, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
    }

    function enterLottery() public payable {
        if (msg.value > i_entranceFee) {
            revert Lottery_NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        //Emit am event when we update a dynamic array or mapping
        //Named events with the function name reversed
        emit LotteryEnter(msg.sender);
    }

    function requestRandomNumber() external {
        //Request the random number
        //Once we get it, do something with it
        // 2 Transaction process
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

    /*View / Pure */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
