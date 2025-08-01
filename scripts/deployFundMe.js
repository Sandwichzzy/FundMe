//import ethers.js
const { ethers } = require("hardhat");

async function main() {
  //creat factory
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("Deploying contract...");
  //deploy contract from factory
  const fundMe = await fundMeFactory.deploy(10);
  await fundMe.waitForDeployment();
  console.log("FundMe deployed to:", fundMe.target);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
