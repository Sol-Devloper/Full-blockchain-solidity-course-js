//describe takes two function a string and function
//beforeEach is to run a particular things before "it" exceutes
const{ethers} = require("hardhat");
const {expect, assert} = require("chai");

describe('simpleStroage', function() {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async function(){
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  })

  it("Should start with a favorite number of 0", async function() {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = '0';
    //assert - 
    assert.equal(currentValue.toString(), expectedValue);
    //except -
    //expect(currentValue.toString()).to.equal(expectedValue);

  })

  it('Should Update favorite number', async function() {
    const expectedValue = '10';
    const txResponse = await simpleStorage.store(expectedValue);
    await txResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    //console.log(currentValue);
    assert.equal(currentValue.toString(), expectedValue);
  })

  it("Adding people", async function() {
    const person = 'Amit';
    const favoriteNumber = '8'
    const addPeople = await simpleStorage.addPerson(person,favoriteNumber);
    await addPeople.wait(1);
  })
})
