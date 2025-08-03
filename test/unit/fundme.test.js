const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("test FundMe contract", async function () {
      let fundMe; //contract
      let owner; //address
      let mockV3Aggregator; //contract
      let secondAccountSigner; //signer
      beforeEach(async function () {
        await deployments.fixture(["all"]);
        owner = (await getNamedAccounts()).owner;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        mockV3Aggregator = await deployments.get("MockV3Aggregator");
        const signers = await ethers.getSigners();
        secondAccountSigner = signers[1];
      });

      it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment();
        expect(await fundMe.owner()).to.equal(owner);
      });

      it("test if the datafeed is correct", async function () {
        await fundMe.waitForDeployment();
        assert.equal(await fundMe.dataFeed(), mockV3Aggregator.address);
      });

      //unit test for fund function
      //window open, value > minimum value, funder balance
      it("window closed,value > minimum value,fund failded", async function () {
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        //make sure the value is greater than the minimum value
        await expect(
          fundMe.fund({ value: ethers.parseEther("0.05") })
        ).to.be.revertedWith("window is closed");
      });

      it("window open,value < minimum value,fund failed", async function () {
        await expect(
          fundMe.fund({ value: ethers.parseEther("0.01") })
        ).to.be.revertedWith("Send more ETH");
      });

      it("window open,value > minimum value,fund success", async function () {
        //greater than minimum value
        await fundMe.fund({ value: ethers.parseEther("0.05") });
        const balance = await fundMe.fundersToAmount(owner);
        expect(balance).to.equal(ethers.parseEther("0.05"));
      });

      //unit test for getFund
      //onlyowner, window closed ,target reached
      it("not owner, window closed, target reached,getFund failed", async function () {
        // make sure target is reached
        await fundMe.fund({ value: ethers.parseEther("1") });
        await helpers.time.increase(400);
        await helpers.mine();

        await expect(
          fundMe.connect(secondAccountSigner).getFund()
        ).to.be.revertedWith("this function can only be called by owner");
      });

      it("owner, window open, target reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") });
        await expect(fundMe.getFund()).to.be.revertedWith(
          "window is not closed"
        );
      });

      it("window closed, target not reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        await expect(fundMe.getFund()).to.be.revertedWith(
          "Target is not reached"
        );
      });

      it("window closed, target reached, getFund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") });
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        await expect(fundMe.getFund())
          .to.emit(fundMe, "FundWithdrawByOwner")
          .withArgs(ethers.parseEther("1"));
      });

      //refund, window closed, target not reached,fundersToAmount is not 0
      it("window open, target not reached,fundersToAmount is not 0,refund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        await expect(fundMe.refund()).to.be.revertedWith(
          "window is not closed"
        );
      });

      it("window closed, target reached,fundersToAmount has balance,refund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") });
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        await expect(fundMe.refund()).to.be.revertedWith("Target is reached");
      });

      it("window closed, target not reached,funder doesnot has balance,refund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        await expect(
          fundMe.connect(secondAccountSigner).refund()
        ).to.be.revertedWith("there is no fund for you");
      });

      it("window closed, target not reached,fundersToAmount has balance,refund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        //make sure the window is closed
        await helpers.time.increase(400);
        await helpers.mine();
        await expect(fundMe.refund())
          .to.emit(fundMe, "RefundByFunder")
          .withArgs(owner, ethers.parseEther("0.1"));
      });
    });
