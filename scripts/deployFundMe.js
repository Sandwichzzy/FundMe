//import ethers.js

const { ethers } = require("hardhat");
//create main function

async function main() {
  //creat factory
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("Deploying contract...");
  //deploy contract from factory
  const fundMe = await fundMeFactory.deploy(300);
  await fundMe.waitForDeployment();
  console.log("FundMe deployed to:", fundMe.target);

  //verify fundme contract
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for 5 blocks...");
    await fundMe.deploymentTransaction().wait(5);
    await verifyFundMe(fundMe.target, [300]);
  } else {
    console.log("skipping verification");
  }
  //init 2 accounts
  const [owner, secondAccount, thirdAccount] = await ethers.getSigners();
  //fund contract with first account
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.01") });
  await fundTx.wait();
  //check balance of contract
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
  console.log("balance of contract", balanceOfContract);
  //fund contract with second account
  const fundTx2 = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.02") });
  await fundTx2.wait();
  //check balance of contract
  const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target);
  console.log("balance of contract", balanceOfContract2);
  //check mapping funderToAmount
  const firstAccountBalance = await fundMe.fundersToAmount(owner.address);
  const secondAccountBalance = await fundMe.fundersToAmount(
    secondAccount.address
  );
  console.log(
    `firstAccountBalance:${owner.address} is ${firstAccountBalance}, secondAccountBalance: ${secondAccount.address} is ${secondAccountBalance}`
  );
}

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

//execute main function
main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
