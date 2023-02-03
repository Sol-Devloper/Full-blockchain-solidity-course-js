// imports

const{ethers} = require("hardhat");

//async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(`deploying contract address: ${simpleStorage.address}`)
}

//main
main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});