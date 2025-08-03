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
  56: {
    name: "BNB",
    ethUsdPriceFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
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
