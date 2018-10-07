import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';

//import Admin from './routes/Admin.jsx';
import User from './routes/User.jsx';
import Admin1 from './routes/Admin1.jsx';
import Admin2 from './routes/Admin2.jsx';
import Organizer from './routes/Organizer.jsx';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Admin1} />
      <Route path="/user" component={User} />
      <Route path="/admin1" component={Admin1} />
      <Route path="/admin2" component={Admin2} />
      <Route path="/org" component={Organizer} />
    </div>
  </Router>
);

export default hot(module)(Routes);
