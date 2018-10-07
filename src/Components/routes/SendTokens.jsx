import React, { Component } from 'react';

export default ({callback, customerAddress}) => (
  <div className="block-send-token">
    <div className="tooltip">
      <span className="text">Now you can send tokens to {customerAddress}</span>
    </div>
    <button className="button button-send" onClick={callback}>
      Send
    </button>
  </div>
);
