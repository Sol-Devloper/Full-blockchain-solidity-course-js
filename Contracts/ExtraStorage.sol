// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";


//Inherating the another contract functionality can be done by the keyword "is", the current contract will inhert all the functionality of other contract. \
//This will be child contract, inherting from teh other contract.
contract ExtraStorage is SimpleStorage{

    //virtual Override
    //virtual keyword need to be added to the parent contract and Override keyword to the child contract.
    function store(uint256 _favoriteNumber) public override{
        favoriteNumber = _favoriteNumber +5;
    }
}