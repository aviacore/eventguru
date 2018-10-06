import React, { Component } from 'react';
import contract, { contractAddress } from '../services/web3';
import { parseNumber } from '../../test/helpers/bignumberUtils';

export default class AdminPage extends Component {
  contract = contract.at(contractAddress);

  state = {
    customerAddress: '',
    balance: ''
  };

  changeAddress = ({ target }) => {
    console.log(target.value);
    this.setState({ customerAddress: target.value });
  };

  checkBalance = () => {
    console.log(this.contract);
    this.contract.balanceOf(web3.eth.accounts[0], (err, res) => {
      const balance = parseNumber(res);
      console.log(balance);
      this.setState({ balance });
      debugger;
    });
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <div>Admin page</div>
        <hr />
        <button>Scan qr</button>
        <input value={this.state.customerAddress} onChange={this.changeAddress} />
        <hr />
        <button onClick={this.checkBalance}>Check balance</button>
        Current Balance: {this.state.balance}
      </div>
    );
  }
}
