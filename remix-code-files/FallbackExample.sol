// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FallbackExample{
    uint256 public result;

    //receive function will trrigger when there is no data avaiable with a transactions, only value!!
    receive() external payable{
        result = 1;
    }

    //fallback function will trigger when there is value and data being sent with a transaction.
    fallback() external payable{
        result =2;
    }

}