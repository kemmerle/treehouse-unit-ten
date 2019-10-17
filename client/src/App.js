import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import Courses from './components/Courses';

import withContext from './Context';
import PrivateRoute from './PrivateRoute';

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

export default () => (
  <Router>
     <div>
       <HeaderWithContext />
       <Switch>
         <Route exact path="/" component={Courses} />
         <Route path="/signin" component={UserSignInWithContext} />
         <Route path="/signup" component={UserSignUpWithContext} />
         <Route path="/signout" component={UserSignOutWithContext} />
         <PrivateRoute path="/authenticated" component={AuthWithContext} />
         <Route component={NotFound} />
       </Switch>
     </div>
   </Router>
);
