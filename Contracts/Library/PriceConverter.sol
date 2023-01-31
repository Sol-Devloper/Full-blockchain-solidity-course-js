//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//interface is same as contract, you cant ether and put state variable in the library;

library PriceConverter{
    
     function getPrice() internal view returns (uint256) {
        //we will need to things:ABI and address;
        //address - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        (, int price, , ,) =  priceFeed.latestRoundData();
        //Price of ETH in USD, 3000.00000000 - to match the uint or smae number of zeros = wei
        return uint256(price * 1e10); // type casting, converting Int256 ro uint256;

    }

    function version() internal view returns(uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount)internal view returns(uint256) {
        //both the values must be in 1e18 format, in order to get the right result.
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount)/1e18; //always multiple and divide first
        return ethAmountInUsd; 
    }
}