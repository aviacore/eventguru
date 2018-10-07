import testdata from '../artifacts/gurutAbi.json';
import { parseNumber } from '../../test/helpers/bignumberUtils';
import 'web3';

const promisify = inner => (...args) =>
  new Promise((resolve, reject) =>
    inner(...args, (err, res) => (err ? reject(err) : resolve(res)))
  );

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

export const contractAddress = testdata.address;
const contract = web3.eth.contract(testdata.abi).at(contractAddress);
console.log(contract);

export default contract;

const functionNames = Object.keys(contract);

export const contractFunctions = functionNames.reduce((res, funcName) => {
  const func = contract[funcName];
  if (typeof func === 'function') {
    if (funcName === 'transfer') {
      return {
        ...res,
        [funcName]: (...args) =>
          promisify(func['address,uint256,bytes'])(...args, { from: web3.defaultAccount })
      };
    }

    return { ...res, [funcName]: promisify(func) };
  }

  return res;
}, {});

export const balanceOf = (address = web3.eth.accounts[0]) =>
  contractFunctions.balanceOf(address).then(parseNumber);

// symbol: ƒ () string
// name: ƒ () string
// decimals: ƒ () number
// totalSupply: ƒ () number

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
// contactInformation: ƒ ()
// decreaseApproval: ƒ ()
// increaseApproval: ƒ ()
// mint: ƒ ()
// owner: ƒ ()
// renounceOwnership: ƒ ()
// setContactInformation: ƒ ()
// transactionHash: null
// transfer: ƒ ()
// transferFrom: ƒ ()
// transferOwnership
