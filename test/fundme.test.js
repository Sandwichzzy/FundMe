const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect } = require("chai");

describe("test FundMe contract", async function () {
  let fundMe;
  let owner;
  beforeEach(async function () {
    await deployments.fixture(["all"]);
    owner = (await getNamedAccounts()).owner;
    const fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
  });

  it("test if the owner is msg.sender", async function () {
    await fundMe.waitForDeployment();
    expect(await fundMe.owner()).to.equal(owner);
  });

  it("test if the datafeed is correct", async function () {
    await fundMe.waitForDeployment();
    expect(await fundMe.dataFeed()).to.equal(
      "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    );
  });
});
