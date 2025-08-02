const { task } = require("hardhat/config");

task("interact-fundme", "Interact with a fundme contract")
  .addParam("addr", "The address of the fundme contract")
  .setAction(async (taskArgs, hre) => {
    //init 2 accounts
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);
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
  });
