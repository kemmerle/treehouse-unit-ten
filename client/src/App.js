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
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

import withContext from './Context';
import PrivateRoute from './PrivateRoute';

const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

export default () => (
  <Router>
     <div>
       <HeaderWithContext />
       <Switch>
         <Route exact path='/' component={CoursesWithContext} />
         <Route exact path='/courses' component={CoursesWithContext} />
         <PrivateRoute exact path='/courses/create' component={CreateCourseWithContext}/>
         <PrivateRoute exact path='/courses/:id/update' component={UpdateCourseWithContext}/>
         <Route exact path='/courses/:id' component={CourseDetailWithContext} />
         <Route path='/signin' component={UserSignInWithContext} />
         <Route path='/signup' component={UserSignUpWithContext} />
         <Route path='/signout' component={UserSignOutWithContext} />
         <Route path='/forbidden' component={Forbidden} />
         <Route path='/error' component={UnhandledError} />
         <Route component={NotFound} />
       </Switch>
     </div>
   </Router>
);
