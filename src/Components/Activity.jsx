import React from 'react';

import icon1 from '../assets/img/icon1.png';
import icon2 from '../assets/img/icon2.png';
import icon3 from '../assets/img/icon3.png';

export default ({ id, callback, activityLimit, activityName, activityTokens }) => (
  <div
    className={activityLimit === 0 ? 'element deactivated' : 'element'}
    onClick={() => callback(id)}
  >
    <div className="name">
      <div className="icon">
        <img src={icon1} />
      </div>
      <div className="text">{activityName}</div>
    </div>
    <div className="limit">
      <div className="icon">
        <img src={icon2} />
      </div>
      <div className="text">{activityLimit}</div>
    </div>
    <div className="tokens">
      <div className="icon">
        <img src={icon3} />
      </div>
      <div className="text">{activityTokens}</div>
    </div>
  </div>
);
