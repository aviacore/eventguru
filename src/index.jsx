import React from 'react';
import { render } from 'react-dom';
import Routes from './routes.jsx';
import '../styles/index.scss';

import './services/web3';

render(<Routes />, document.querySelector('#root'));
