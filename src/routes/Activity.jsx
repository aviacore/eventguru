import React, { Component } from 'react';

import icon1 from '../assets/img/icon1.png';
import icon2 from '../assets/img/icon2.png';
import icon3 from '../assets/img/icon3.png';

export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activityName: props.activityName,
            activityLimit: parseInt( props.activityLimit),
            activityTokens: parseInt( props.activityTokens),
            parent: props.parent,
            method: props.method,
            id: props.dataId
        }
    }
    
    click = () => {
        if( this.state.parent == 'admin2') {
            this.state.method('somebody', this.state.id);
            
            
        } else if (this.state.parent == 'organizer') {
            //open modal there
            
        }
    }
    

    render() {
        return (
            
            <div className={this.state.activityLimit == 0 ? 'element deactivated' : 'element'} onClick={this.click }>
                <div className="name">
                    <div className="icon"><img src={icon1}></img></div>
                    <div className="text">{this.state.activityName}</div>
                </div>
                <div className="limit">
                    <div className="icon"><img src={icon2}></img></div>
                    <div className="text">{this.state.activityLimit}</div>
                </div>
                <div className="tokens">
                    <div className="icon"><img src={icon3}></img></div>
                    <div className="text">{this.state.activityTokens}</div>
                </div>
            </div>
        );
    }
}