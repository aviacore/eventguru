import React, { Component } from 'react';
import Activity from './Activity.jsx';
import SendTokens from './SendTokens.jsx';

import background from '../assets/img/background.jpg';
import backWave4 from '../assets/img/wave4.png';
import icon1 from '../assets/img/icon1.png';
import icon2 from '../assets/img/icon2.png';
import icon3 from '../assets/img/icon3.png';

const style = {
    backgroundImage: 'url(' + background + ')',
}
export default class Organizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activityList: [
                {
                    id: 0,
                    name: 'Registration',
                    limit: 100,
                    tokens: 1
                },
                {
                    id: 1,
                    name: 'Question',
                    limit: 3,
                    tokens: 1
                },
                {
                    id: 2,
                    name: 'Speaker',
                    limit: 4,
                    tokens: 2
                }
            ],
            username: '',
            targetListElement: null
        }
    }
    
    getUsername = ( username, id) => {
        this.setState({ username: username, targetListElement: id });
    }
    sendTokens = (username) => {
        console.log('sended to: ' + username );
        console.log('substruct from: ' + this.state.targetListElement);
        this.setState({username: '', targetListElement: null});
    }
    shrinkLimit(id) {
        let targetElement = this.state.activityList[id];
        let limit = targetElement.limit;
            if(limit != 0) {
                --limit;
                //setState ???
            }
    }
    
    makeActivityList() {
        return this.state.activityList.map( el => 
                                                     <Activity 
                                                         key={el.id}
                                                         activityName={el.name}
                                                         activityLimit={el.limit}
                                                         activityTokens={el.tokens}
                                                         parent="admin2"
                                                         method={this.getUsername}
                                                         dataId={el.id}
                                                    />)
    }
    
    render() {
    return (
        <div className="wrapper" style={style}>
            { this.state.username != '' ?
                <SendTokens username={this.state.username} callback={this.sendTokens}/>
                :
                <div className="block-activity-list">
                    <div className="list">
                        {this.makeActivityList()}
                    </div>
                    <div className="background-layer b-l-4" style={{backgroundImage: 'url(' + backWave4 + ')'}}></div>
                </div>
            }
               
            
            
            
            
        </div>
        
        
    );
  }
}