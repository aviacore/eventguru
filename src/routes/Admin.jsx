import React, { Component } from 'react';
import contract, { contractAddress } from '../services/web3';

export default class AdminPage extends Component {
  contract = contract.at(contractAddress);

  state = {
    customerAddress: ''
  };

  changeAddress = ({ target }) => {
    console.log(target.value);
    this.setState({ customerAddress: target.value });
  };

  registerUser = () => {
    console.log(this.contract);
  };

  componentDidMount() {
    this.contract.balanceOf('0x6C9462784D2bB30BB4D4e12eEa66dda950991259', (err, res) => {
      debugger;
    });
  }

  render() {
    return (
      <div>
        <div>Admin page</div>
        <hr />
        <button>Scan qr</button>
        <input value={this.state.customerAddress} onChange={this.changeAddress} />
        <hr />
        <button onClick={this.registerUser}>Register</button>
      </div>
    );
  }
}
