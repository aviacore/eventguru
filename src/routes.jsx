import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Admin from './routes/Admin.jsx';

const Routes = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin">About</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Admin} />
      <Route path="/admin" component={Admin} />
    </div>
  </Router>
);

export default hot(module)(Routes);
