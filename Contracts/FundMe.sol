//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Interface - is basically an ABI, without an implementation of the functions. inferface (type) xx = interface(contract.address)
//by combining the interface and contract address - we can implement the function fuctionality. 

import './library/PriceConverter.sol';

contract FundMe{

    using PriceConverter for uint256; //this how you call a library

    uint256 public minimumUSD = 50 *1e18;

    address[] public funders;

    mapping (address => uint256) public addressToAmountFunded;

    function fund()public payable{
        //wante to be able to set a minimum fund amount in USD
        // 1. How to we send ETH to this contract - by making it payable
        //require(getConversionRate(msg.value )> minimumUSD, "Not enough Fund"); //1e18 ==1 * 10 **8 == 1 eth

        require(msg.value.getConversionRate() > minimumUSD, "Not enough Fund"); // this method is used whwn using a library;

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    // function withdraw()public {}
}