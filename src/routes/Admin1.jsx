import React, { Component } from 'react';
import background from '../assets/img/background.jpg';
import backWave1 from '../assets/img/wave1.png';
import backWave2 from '../assets/img/wave2.png';
import backWave3 from '../assets/img/wave3.png';
import imgButtonScan from '../assets/img/photo_camera.png';
import SendTokens from './SendTokens.jsx';

const style = {
    backgroundImage: 'url(' + background + ')',
}

export default class Admin1 extends Component {
    constructor(props){
        super(props);
        this.state = {
            scanerOpened: false,
            username: ''
        };
        this.openScaner = this.openScaner.bind(this);
        this.submitScaner = this.submitScaner.bind(this);
    }
    openScaner() {
        console.log('opening scaner');
        this.setState( {scanerOpened: true });
    }
    submitScaner() {
        console.log('scanning finished');
        this.setState({scanerOpened: false, username: 'somebody'});
    }
    

render() {
    return (
        <div className="wrapper" style={style}>
            { this.state.username == '' &&
                <div className="block-open-scaner">
                    <div className="tooltip">
                        <span className="text">Press the button and hover your camera on the QR code</span>
                    </div>
                    <button 
                        className="button button-reg"
                        style={{backgroundImage: 'url(' + imgButtonScan + ')'}}
                        onClick={this.openScaner}
                    ></button>
               </div>
            }
           
            { this.state.username != '' &&
                <SendTokens username={this.state.username}/>
            }
            
              
            <div className="background-layer b-l-3" style={{backgroundImage: 'url(' + backWave3 + ')'}}></div>
            <div className="background-layer b-l-2" style={{backgroundImage: 'url(' + backWave2 + ')'}}></div>
            <div className="background-layer b-l-1" style={{backgroundImage: 'url(' + backWave1 + ')'}}></div>
            
            {this.state.scanerOpened &&
                <div className="scaner" onClick={this.submitScaner}></div>
            }
        </div>
    );
  }
}