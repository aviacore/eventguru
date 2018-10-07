import React, { Component } from 'react';
import SendTokens from './SendTokens.jsx';
import ActivitiesList from '../Activities.jsx';
import Scanner from '../Scanner.jsx';

import background from '../../assets/img/background.jpg';
import backWave4 from '../../assets/img/wave4.png';

import { activities, activitiesMap } from '../../services/constants';
import { contractFunctions } from '../../services/guruContract';

const style = {
  backgroundImage: 'url(' + background + ')'
};
export default class Organizer extends Component {
  state = { isScanActive: false, customerAddress: '', selectedActivity: '' };

  // sendTokens = customerAddress => {
  //   console.log('sended to: ' + customerAddress);
  //   console.log('substruct from: ' + this.state.targetListElement);
  //   this.setState({ customerAddress: '', targetListElement: null });
  // };

  sendTokens = () =>
    contractFunctions
      .transfer(
        this.state.customerAddress,
        activitiesMap[this.state.selectedActivity].tokens,
        activitiesMap[this.state.selectedActivity].data
      )
      .then(console.log)
      .then(() => this.setState({ customerAddress: '', selectedActivity: '' }));

  openScanner = selectedActivity => this.setState({ selectedActivity, isScanActive: true });

  handleScan = customerAddress => this.setState({ customerAddress, isScanActive: false });

  render() {
    return this.state.isScanActive ? (
      <Scanner handleScan={this.handleScan} />
    ) : (
      <div className="wrapper" style={style}>
        {this.state.customerAddress ? (
          <SendTokens customerAddress={this.state.customerAddress} callback={this.sendTokens} />
        ) : (
          <div className="block-activity-list">
            <ActivitiesList activityList={activities} callback={this.openScanner} />
            <div
              className="background-layer b-l-4"
              style={{ backgroundImage: 'url(' + backWave4 + ')' }}
            />
          </div>
        )}
      </div>
    );
  }
}
