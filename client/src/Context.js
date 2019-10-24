import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

export class Provider extends Component {

  //In state, I retrieve my authenticatedUser and authenticatedUserPassword from
  //my Cookies (part of the js-cookie npm module). If there are no cookies, I
  //set both properties to null.
  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    authenticatedUserPassword: Cookies.getJSON('userPassword') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    //I retrieve my authenticated user's information from state and save it as
    //handy variables.
    const { authenticatedUser, authenticatedUserPassword } = this.state;
    //I save my authenticated user's information, the data associated with my
    //Context (stored in Data.js), and the actions defined below to an object
    //named value, which I then pass to my Context to hand down to all my components.
    const value = {
      authenticatedUser,
      authenticatedUserPassword,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }


  /*In my signIn method, I retrieve my user information from my API using my
  getUser method stored in Data.js. I then save this user information in state,
  and I set my Cookies, so that my user data can be stored for one day. */
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          authenticatedUserPassword: password
        };
      });
      //In the original starter files, {expires: 1} was assigned to a cookieOptions
      //variable, but when I used that variable to set the cookie's expiration,
      //I received the following error: Unhandled Rejection (TypeError):
      //attributes[attributeName].split is not a function. Simply removing the
      //variable seemed to solve the issue.
      Cookies.set('authenticatedUser', JSON.stringify(user), {expires: 1});
      Cookies.set('userPassword', JSON.stringify(password), {expires: 1});
    }
    return user;
  }

  //In my signOut method, I set both properties in state to null (removing the
  //user's information), and I remove the Cookies that store that data, as well.
  signOut = () => {
    this.setState({
      authenticatedUser: null,
      authenticatedUserPassword: null
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('authenticatedUserPassword');
  }
}

export const Consumer = Context.Consumer;

//I export the function withContext() which I can then use in my App.js to ensure
//that all my components receive the data stored in Context.
export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
