import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  /* First I retrieve my context and all its data from the props passed down to
  each of my components by the Context API, and I save it to a handy variable.
  Then I retrieve the authenticated user from Context and save them to the
  authUser variable. */
  const { context } = props;
  const authUser = context.authenticatedUser;

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo"><NavLink to="/">Courses</NavLink></h1>
        <nav>
        {/* I use a ternary operator to determine what I will display in my Header
          component. If the authUser variable returns as true, I display the
          authorized user's name and a Sign Out link. If authUser is false, I
          display a link to the Sign Up and Sign In pages.  */}
          {authUser ? (
            <React.Fragment>
              <span>Welcome, {authUser.firstName} {authUser.lastName}!</span>
              <NavLink className="signout" to="/signout">Sign Out</NavLink>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NavLink className="signup" to={{
                pathname:'/signup',
                state: { from: props.location }
              }}>Sign Up</NavLink>
              <NavLink className="signin" to={{
                pathname:'/signin',
                state: { from: props.location }
              }}>Sign In</NavLink>
            </React.Fragment>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;
