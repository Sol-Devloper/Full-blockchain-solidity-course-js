//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Interface - is basically an ABI, without an implementation of the functions. inferface (type) xx = interface(contract.address)
//by combining the interface and contract address - we can implement the function fuctionality. 

import './PriceConverter.sol';

error NotOwner();

contract FundMe{

    using PriceConverter for uint256; //this how you call a library
    address[] public funders;
    mapping (address => uint256) public addressToAmountFunded;

    //constant keyword dont use any storage, naming convention is also different ALL CAPS and use _. - Can only be set once!!
    uint256 public constant MINIMUM_USD = 50 *1e18;
    //immutable can be assigned while launhting teh contract. Both Constant and Immutable keyword are gas efficient and must be used carefully. - Can only be set once or at the
    // time of deploying a contract!!
    address public immutable i_owner;

    constructor (){
        i_owner = msg.sender;
    }

    modifier onlyOwner(){
        // require(i_owner == msg.sender, "Sender is not owner");
        if(i_owner == msg.sender) { revert NotOwner();}
        _;
    }

    function fund()public payable{
        //wante to be able to set a minimum fund amount in USD
        // 1. How to we send ETH to this contract - by making it payable
        //require(getConversionRate(msg.value )> minimumUSD, "Not enough Fund"); //1e18 ==1 * 10 **8 == 1 eth

        require(msg.value.getConversionRate() > MINIMUM_USD, "Not enough Fund"); // this method is used whwn using a library;

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

    //what happen if the person send ETH to this contract wothout calling the fund function?

    //receive()
    //fallback()

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }
}