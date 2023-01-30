// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './SimpleStorage.sol';

contract StorageFactory{ 

    SimpleStorage[] public simpleStorageArray;

    //To create a new contract with another contract, solodity can held multiple contracts in one file.
    function createSimpleStorageFactory() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        // Two things are required when calling another contract which is contract address and ABI (Application Binary Interface)
        // SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        // simpleStorage.store(_simpleStorageNumber);
        //easy way to do it
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256){
        // SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        // return simpleStorage.retrieve();
        //easy way to do it
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}