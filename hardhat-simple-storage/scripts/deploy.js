// imports
const{ethers, run, network} = require("hardhat");

//run to run hardhat commands
//network to check netwrok details

//async main
async function main() {
  //To deploy the netwrok
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`deploying contract address: ${simpleStorage.address}`);

  //to verify the network
  //console.log(network.config);
  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
    console.log("waiting for block confirmations....")
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  //interacting with the contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`The current value is: ${currentValue}`);

  //updating the value
  const txResponse = await simpleStorage.store(7);
  await txResponse.wait(1);
  const updateValue= await simpleStorage.retrieve();
  console.log(`The Updates Value: ${updateValue}`);
   
}

async function verify(contractAddress, args){
  console.log('verifying contract...')
  try {await run("verify:verify", {
    address: contractAddress,
    constructorAeguments: args,
  })} catch(e){
    if (e.message.toLowerCase().includes('already verified')){
      console.log('Already Verified')
    }else{
      console.log(e)
    }
  }
}

//main
main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});