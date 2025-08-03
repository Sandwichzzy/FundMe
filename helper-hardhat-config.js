const DECIMAL = 8;
const INITIAL_ANSWER = 300000000000;
const developmentChains = ["hardhat", "local"];
const LOCK_TIME = 300;
const CONFIRMATION_BLOCKS = 5;
const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

module.exports = {
  DECIMAL,
  INITIAL_ANSWER,
  developmentChains,
  networkConfig,
  LOCK_TIME,
  CONFIRMATION_BLOCKS,
};
