import React, { Component } from 'react';
import contract, { contractAddress } from '../services/web3';
import {parseNumber} from '../../test/helpers/bignumberUtils';

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
    this.contract.balanceOf(contractAddress, function(err, res) {
        console.log(parseNumber(res));
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
        <button onClick={this.registerUser}>Register</button>
      </div>
    );
  }
}
