import React, { Component } from 'react';
import contract from '../services/guruContract';
import { parseNumber } from '../../test/helpers/bignumberUtils';
import Scanner from '../services/Scanner.jsx';
import img from '../assets/logo.png';

export default class AdminPage extends Component {
  state = {
    customerAddress: '',
    balance: '',
    isScanActive: false
  };

  changeAddress = ({ target }) => {
    console.log(target.value);
    this.setState({ customerAddress: target.value });
  };

  checkBalance = () => {
    console.log(contract);
    contract.balanceOf(web3.eth.accounts[0], (err, res) => {
      const balance = parseNumber(res);
      console.log(balance);
      this.setState({ balance });
      debugger;
    });
  };

  handleScan = customerAddress => {
    this.setState({ customerAddress, isScanActive: false });
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <img src={img} />
        <div>Admin page</div>
        <hr />
        <button onClick={() => this.setState({ isScanActive: true })}>Scan qr</button>
        {this.state.isScanActive && <Scanner handleScan={this.handleScan} />}
        <input value={this.state.customerAddress} onChange={this.changeAddress} />
        <hr />
        <button onClick={this.checkBalance}>Check balance</button>
        <hr />
        Current Balance: {this.state.balance}
      </div>
    );
  }
}
