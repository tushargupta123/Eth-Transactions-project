require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli:{
      url: 'https://eth-goerli.g.alchemy.com/v2/ykNx0Yycb7C2hbM4nZhTtjDVfcsZP-z_',
      accounts: ['2105c41bc0ef5bce510d6fc64db7eb17788b8a12bab61e11db41d195d701ab9d']
    }
  }
}