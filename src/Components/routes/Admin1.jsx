import React, { Component } from 'react';
import SendTokens from './SendTokens.jsx';
import Scanner from '../Scanner.jsx';
import {contractFunctions} from '../../services/guruContract';

import background from '../../assets/img/background.jpg';
import backWave1 from '../../assets/img/wave1.png';
import backWave2 from '../../assets/img/wave2.png';
import backWave3 from '../../assets/img/wave3.png';
import imgButtonScan from '../../assets/img/photo_camera.png';
import { activitiesMap } from '../../services/constants';

const registerActivity = activitiesMap.registration;

const style = {
  backgroundImage: 'url(' + background + ')'
};

export default class Admin1 extends Component {
  state = {
    isScanActive: false,
    customerAddress: ''
  };

  openScanner = () => this.setState({ isScanActive: true });

  handleScan = customerAddress => this.setState({ customerAddress, isScanActive: false });

  sendTokens = () =>
    contractFunctions
      .transfer(this.state.customerAddress, registerActivity.tokens, registerActivity.data)
      .then(console.log)
      .then(() => this.setState({ customerAddress: '' }));

  render() {
    return this.state.isScanActive ? (
      <Scanner handleScan={this.handleScan} />
    ) : (
      <div className="wrapper" style={style}>
        {!this.state.customerAddress && (
          <div className="block-open-scaner">
            <div className="tooltip">
              <span className="text">Press the button and hover your camera on the QR code</span>
            </div>
            <button
              className="button button-reg"
              style={{ backgroundImage: 'url(' + imgButtonScan + ')' }}
              onClick={this.openScanner}
            />
          </div>
        )}

        {this.state.customerAddress && <SendTokens callback={this.sendTokens} customerAddress={this.state.customerAddress}/>}

        <div
          className="background-layer b-l-3"
          style={{ backgroundImage: 'url(' + backWave3 + ')' }}
        />
        <div
          className="background-layer b-l-2"
          style={{ backgroundImage: 'url(' + backWave2 + ')' }}
        />
        <div
          className="background-layer b-l-1"
          style={{ backgroundImage: 'url(' + backWave1 + ')' }}
        />
      </div>
    );
  }
}
