const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("test FundMe contract", async function () {
  it("test if the owner is msg.sender", async function () {
    const [owner] = await ethers.getSigners();
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    expect(await fundMe.owner()).to.equal(owner.address);
  });

  it("test if the datafeed is correct", async function () {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    expect(await fundMe.dataFeed()).to.equal(
      "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    );
  });
});
