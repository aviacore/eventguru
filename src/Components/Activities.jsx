import React, { Component } from 'react';
import Activity from './Activity.jsx';

export default ({ activityList, callback }) => (
  <div className="list">
    {activityList.map(el => (
      <Activity
        key={el.id}
        id={el.id}
        activityName={el.name}
        activityLimit={el.limit}
        activityTokens={el.tokens}
        callback={callback}
      />
    ))}
  </div>
);
