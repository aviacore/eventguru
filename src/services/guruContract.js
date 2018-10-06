import testdata from '../artifacts/gurutAbi.json';
import { parseNumber } from '../../test/helpers/bignumberUtils';

// if (typeof web3 === 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
// set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// }

web3.eth.defaultAccount = web3.eth.accounts[0];

export const contractAddress = testdata.address;
export default web3.eth.contract(testdata.abi).at(contractAddress);

// Approval: ƒ ()
// Mint: ƒ ()
// OwnershipRenounced: ƒ ()
// OwnershipTransferred: ƒ ()
// Transfer: ƒ ()
// abi: (26) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// address: "0x87474339a5AEC09A6A5a19F3cA6a182dC454dEB9"
// allEvents: ƒ ()
// allowance: ƒ ()
// approve: ƒ ()
export const balanceOf = (address = web3.eth.accounts[0]) => {
  return new Promise((resolve, reject) => {
    contract.balanceOf(address, (err, res) => {
      err ? reject(err) : resolve(parseNumber(res));
    });
  });
};
// contactInformation: ƒ ()
// decimals: ƒ ()
// decreaseApproval: ƒ ()
// increaseApproval: ƒ ()
// mint: ƒ ()
// name: ƒ ()
// owner: ƒ ()
// renounceOwnership: ƒ ()
// setContactInformation: ƒ ()
// symbol: ƒ ()
// totalSupply: ƒ ()
// transactionHash: null
// transfer: ƒ ()
// transferFrom: ƒ ()
// transferOwnership: ƒ ()
