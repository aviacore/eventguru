import testdata from '../artifacts/gurutAbi.json';

// if (typeof web3 === 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// }

web3.eth.defaultAccount = web3.eth.accounts[0];

export const contractAddress = testdata.address;
export default web3.eth.contract(testdata.abi);
