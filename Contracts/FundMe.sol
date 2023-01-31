//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Interface - is basically an ABI, without an implementation of the functions. inferface (type) xx = interface(contract.address)
//by combining the interface and contract address - we can implement the function fuctionality. 

import './PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256; //this how you call a library

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders;

    mapping (address => uint256) public addressToAmountFunded;

    address public owner;

    constructor (){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "Sender is not owner");
        _;
    }

    function fund()public payable{
        //wante to be able to set a minimum fund amount in USD
        // 1. How to we send ETH to this contract - by making it payable
        //require(getConversionRate(msg.value )> minimumUSD, "Not enough Fund"); //1e18 ==1 * 10 **8 == 1 eth

        require(msg.value.getConversionRate() > minimumUSD, "Not enough Fund"); // this method is used whwn using a library;

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw()public onlyOwner {

        for(uint256 i = 0; i < funders.length; i++){
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }

        //reset the array
        funders = new address[](0); //intead of deleting the arrays elements we refresh it, we (0) at the end, let you start with 0 element

        //how to withdraw the fund - tranfer/call/send

        //transfer - use 2300 gas, if more is used, it throws as error 
        //this keyword refers to this contract address
        //msg.sender = address
        //payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);

        //send - use 2300 gas, if more gas is usedm it will return the bool value
        // bool sendSucess = payable(msg.sender).send(address(this).balance);
        // require(sendSucess, "Send Failed");

        //call - return bool and byes data(always in memory, becoz its an error), its the recommded way to send and receive eth or other native token.
        (bool callSucess, ) = payable(msg.sender).call{value: address(this).balance}('');
        require(callSucess, "Call Failed");        
    }
}