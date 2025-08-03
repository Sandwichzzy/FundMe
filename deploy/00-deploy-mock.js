const {
  DECIMAL,
  INITIAL_ANSWER,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  if (developmentChains.includes(network.name)) {
    const owner = (await getNamedAccounts()).owner;
    const { deploy } = deployments;
    await deploy("MockV3Aggregator", {
      from: owner,
      args: [DECIMAL, INITIAL_ANSWER],
      log: true,
    });
  } else {
    console.log("environment is not local,mock contract is not needed");
  }
};

module.exports.tags = ["all", "mock"];
