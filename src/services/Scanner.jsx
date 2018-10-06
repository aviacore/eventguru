import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

export default class Test extends Component {
  state = {
    delay: 300,
    result: 'No result'
  };

  static handleError(err) {
    console.error(err);
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      });
      this.props.handleScan(data);
    }
  };

  render() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={Test.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}
