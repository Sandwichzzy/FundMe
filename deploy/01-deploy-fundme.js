// module.exports.default=deployFunction
// module.exports= async(hre) => {
//     const getNamdeAccounts = hre.getNamdeAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  LOCK_TIME,
  CONFIRMATION_BLOCKS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const owner = (await getNamedAccounts()).owner;
  const { deploy } = deployments;

  let dataFeedAddr;
  let confirmationBlocks;
  if (developmentChains.includes(network.name)) {
    const mockV3Aggregator = await deployments.get("MockV3Aggregator");
    dataFeedAddr = mockV3Aggregator.address;
    confirmationBlocks = 0;
  } else {
    dataFeedAddr = networkConfig[network.config.chainId].ethUsdPriceFeed;
    confirmationBlocks = CONFIRMATION_BLOCKS;
  }

  const fundMe = await deploy("FundMe", {
    from: owner,
    args: [LOCK_TIME, dataFeedAddr],
    log: true,
    waitConfirmations: confirmationBlocks,
  });
  //remove deployments directory or add --reset flag if you redeploy contract

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    await hre.run("verify:verify", {
      address: fundMe.address,
      constructorArguments: [LOCK_TIME, dataFeedAddr],
    });
  } else {
    console.log("network is not sepolia, skipping verification");
  }
};

module.exports.tags = ["all", "fundme"];
