import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {
  //The UserSignOut component calls the signOut() method stored in Context, which
  //signs out the authenticated user and redirects the user to the home page. 
  context.actions.signOut();

  return (
    <Redirect to="/"/>
  );
}
