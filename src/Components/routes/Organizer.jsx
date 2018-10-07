import React, { Component } from 'react';
import Activity from '../Activity.jsx';
import { activities } from '../../services/constants';

import background from '../../assets/img/background.jpg';
import backWave4 from '../../assets/img/wave4.png';
import imgButtonAdd from '../../assets/img/plus.png';
import icon1 from '../../assets/img/icon1.png';
import icon2 from '../../assets/img/icon2.png';
import icon3 from '../../assets/img/icon3.png';

const style = {
  backgroundImage: 'url(' + background + ')'
};

export default class Organizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redactable: true,
      activityName: '',
      activityLimit: '',
      activityTokens: '',
      activityList: activities,
      modalOpened: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeActivityName = this.changeActivityName.bind(this);
    this.changeActivityLimit = this.changeActivityLimit.bind(this);
    this.changeActivityTokens = this.changeActivityTokens.bind(this);
    this.submitNewActivity = this.submitNewActivity.bind(this);
  }

  openModal = () => {
    this.setState({ modalOpened: true });
  };
  closeModal = () => {
    this.setState({ modalOpened: false });
  };
  submitNewActivity = () => {
    console.log(
      'New Activity: ' +
        this.state.activityName +
        ', ' +
        this.state.activityLimit +
        ', ' +
        this.state.activityTokens
    );
    this.setState({
      activityList: [
        ...this.state.activityList,
        {
          id: this.state.activityList.length,
          name: this.state.activityName,
          limit: parseInt(this.state.activityLimit),
          tokens: parseInt(this.state.activityTokens)
        }
      ]
    });
    console.log(this.state.activityList);
    this.closeModal();
  };
  changeActivityName = e => {
    this.setState({ activityName: e.target.value });
  };
  changeActivityLimit = e => {
    this.setState({ activityLimit: e.target.value });
  };
  changeActivityTokens = e => {
    this.setState({ activityTokens: e.target.value });
  };
  makeActivityList() {
    return this.state.activityList.map(el => (
      <Activity
        key={el.id}
        activityName={el.name}
        activityLimit={el.limit}
        activityTokens={el.tokens}
        dataId={el.id}
        parent="org"
      />
    ));
  }

  render() {
    return (
      <div className="wrapper" style={style}>
        <div className="list">{this.makeActivityList()}</div>

        {this.state.modalOpened && (
          <div className="modal modal-add-custom-activity">
            <div className="background" onClick={this.closeModal} />
            <div className="modal-window">
              <button className="modal-close" onClick={this.closeModal} />
              <div className="form-block acivity">
                <div className="label">
                  <span className="icon">
                    <img src={icon1} />
                  </span>{' '}
                  Activity
                </div>
                <input type="text" onChange={this.changeActivityName} placeholder="name" />
              </div>
              <div className="form-block limit">
                <div className="label">
                  <span className="icon">
                    <img src={icon2} />
                  </span>{' '}
                  Limit
                </div>
                <input type="text" placeholder="limit" onChange={this.changeActivityLimit} />
              </div>
              <div className="form-block tokens">
                <div className="label">
                  <span className="icon">
                    <img src={icon3} />
                  </span>{' '}
                  Tokens
                </div>
                <input type="text" placeholder="tokens" onChange={this.changeActivityTokens} />
              </div>
              <button className="button button-submit-activity" onClick={this.submitNewActivity}>
                Add
              </button>
            </div>
          </div>
        )}

        <div
          className="background-layer b-l-4"
          style={{ backgroundImage: 'url(' + backWave4 + ')' }}
        />

        <button
          className="button button-add"
          style={{ backgroundImage: 'url(' + imgButtonAdd + ')' }}
          onClick={this.openModal}
        />
      </div>
    );
  }
}
