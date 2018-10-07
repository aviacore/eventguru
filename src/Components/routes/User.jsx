import React, { Component } from 'react';
import background from '../../assets/img/background.jpg';
import backWave1 from '../../assets/img/wave1.png';
import backWave2 from '../../assets/img/wave2.png';
import backWave3 from '../../assets/img/wave3.png';
import imgQR from '../../assets/img/QRCode.png';

export default class User extends Component {
  constructor(props) {
      super(props);
      this.state = {
          myQr: imgQR
      };
  }

render() {
    return (
        <div className="wrapper">
            <div className="myQR">
                <img src={this.state.myQr}></img>
            </div>
           
            <div className="background-layer b-l-3" style={{backgroundImage: 'url(' + backWave3 + ')'}}></div>
            <div className="background-layer b-l-2" style={{backgroundImage: 'url(' + backWave2 + ')'}}></div>
            <div className="background-layer b-l-1" style={{backgroundImage: 'url(' + backWave1 + ')'}}></div>
        </div>
    );
  }
}