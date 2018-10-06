const Guru = artifacts.require('Guru');

const teamFund = web3.eth.accounts[3];

module.exports = function(deployer) {
  deployer.deploy(Guru, teamFund);
};
