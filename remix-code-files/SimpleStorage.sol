// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage{
    //Any state variable without the visibility will be set to internal visibility
    //uint256 favoriteNumber;

    //Any unit256 number, if not initilaze will be set to 0
    uint256 favoriteNumber;
    mapping(string => uint256) public nameToFavoriteNumber;

    struct People{
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
        //retrieve;
   }


    //any view and pure function will not cost any gas unless it gets called from the function above
   function retrieve() public view returns(uint256){
        return favoriteNumber;
   }

   //Explanation -  calldata, memory, storage
   //Calldata - is a temporary variable that cant be modified
   //memory - is a temporary variable thats can be modified, 
   //uint256 as a parameter goes straight to the memory thats why no need to add the memory keyword in the below function 
   //Storage - is a permanent variable as a state variuable, it staye in the contract storage. And, can be modified.

   function addPerson(string memory _name, uint256 _favoriteNumber) public{
       //People memory newPerson = People({favoriteNumber: _favoriteNumber, name: _name});
       people.push(People(_favoriteNumber, _name));
       nameToFavoriteNumber[_name] = _favoriteNumber;
   }
}