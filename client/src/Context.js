import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    authenticatedUserPassword: Cookies.getJSON('userPassword') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser, authenticatedUserPassword } = this.state;
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

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
