const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("test FundMe contract", async function () {
      let fundMe; //contract
      let owner; //address
      beforeEach(async function () {
        await deployments.fixture(["all"]);
        owner = (await getNamedAccounts()).owner;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
      });

      //test fund and getFund  successfully
      it("fund and getFund successfully", async function () {
        //make sure the target is reached
        await fundMe.fund({ value: ethers.parseEther("0.5") });
        //make sure window is closed
        await new Promise((resolve) => setTimeout(resolve, 301 * 1000));
        //make sure we can get receipt
        const getFundTx = await fundMe.getFund();
        const getFundReceipt = await getFundTx.wait();
        expect(getFundReceipt)
          .to.be.emit(fundMe, "FundWithdrawByOwner")
          .withArgs(ethers.parseEther("0.5"));
      });
      //test fund and reFund successfully
      it("fund and refund successfully", async function () {
        //make sure the target is not reached
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        //make sure window is closed
        await new Promise((resolve) => setTimeout(resolve, 301 * 1000));
        //make sure we can get receipt
        const refundTx = await fundMe.refund();
        const refundReceipt = await refundTx.wait();
        expect(refundReceipt)
          .to.be.emit(fundMe, "RefundByFunder")
          .withArgs(owner, ethers.parseEther("0.1"));
      });
    });
