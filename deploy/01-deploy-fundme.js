// module.exports.default=deployFunction
// module.exports= async(hre) => {
//     const getNamdeAccounts = hre.getNamdeAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
  const owner = (await getNamedAccounts()).owner;
  const { deploy } = deployments;
  await deploy("FundMe", {
    from: owner,
    args: [300],
    log: true,
  });
};

module.exports.tags = ["all", "fundme"];
