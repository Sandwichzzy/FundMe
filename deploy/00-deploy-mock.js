const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const owner = (await getNamedAccounts()).owner;
  const { deploy } = deployments;
  await deploy("MockV3Aggregator", {
    from: owner,
    args: [DECIMAL, INITIAL_ANSWER],
    log: true,
  });
};

module.exports.tags = ["all", "mock"];
