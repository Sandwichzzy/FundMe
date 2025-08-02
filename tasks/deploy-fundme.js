const { task } = require("hardhat/config");

task("deploy-fundme", "Deploy a fundme contract").setAction(
  async (taskArgs, hre) => {
    //creat factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying contract...");
    //deploy contract from factory
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    console.log("FundMe deployed to:", fundMe.target);

    //verify fundme contract
    if (
      hre.network.config.chainId == 11155111 &&
      process.env.ETHERSCAN_API_KEY
    ) {
      console.log("waiting for 5 blocks...");
      await fundMe.deploymentTransaction().wait(5);
      await verifyFundMe(fundMe.target, [300]);
    } else {
      console.log("skipping verification");
    }
  }
);

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}
