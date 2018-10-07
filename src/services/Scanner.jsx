import React from 'react';
import QrReader from 'react-qr-reader';

export default ({handleScan}) => (
  <div className="scaner" onClick={() => handleScan('')}>
    <QrReader
      delay={300}
      onError={console.error}
      onScan={data => data && handleScan(data)}
      style={{ width: '100vh'}}
    />
  </div>
);
