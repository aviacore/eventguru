import React, { Component } from 'react';


export default class Admin1 extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: props.username,
            callback: props.callback,
            //type://за что идут токены 
        };
    }
    
render() {
    return (
            <div className="block-send-token">
                 <div className="tooltip">
                     <span className="text">Now you can send tokens to {this.state.username}</span>
                 </div>
                 <button 
                     className="button button-send"
                     onClick={() => { this.props.callback(this.state.username)}}
                 >Send</button>
            </div>
    );
  }
}