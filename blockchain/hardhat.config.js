require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
      url:'https://eth-goerli.g.alchemy.com/v2/iMIDA9uXBjfp_iGqqfidAqrAhh5zYAPR',
      accounts:['0795865ae3e18c5e85c703d9e3ff9e3f7e1432fe444a59aefa843af3a3a3ee5b',]
    }
  }
};
