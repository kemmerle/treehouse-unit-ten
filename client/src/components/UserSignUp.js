import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Form from './Form';

export default class UserSignUp extends Component {
  /* Here I set the initial state of the component and give it six properties:
  firstName, lastName, emailAddress password, and confirmPassword, all empty
  strings, and errors, an empty array, where I can hold any error messages. */
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: []
  }

  render() {
    /* In my render, I retrieve all the properties from state and save them to
    their own handy variables. */
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          {/* I pass my form down five props:
            1) cancel, which holds the cancel function I have defined below;
            2) errors, the errors array held in state in case of validation errors;
            3) submit, which holds the submit function I have defined below;
            4) the text for the submit button,
            5) and the elements (ie. the input fields) that the form will hold.
            I use React Fragments because 'Fragments let you group a list of
            children without adding extra nodes to the DOM.'
             See: https://reactjs.org/docs/fragments.html */}
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={this.change}
                  placeholder="First Name" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={this.change}
                  placeholder="Last Name" />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={this.change}
                  placeholder="Email Address" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                  placeholder="Password" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.change}
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    /* My change function allows me to make the CreateCourse component a 'controlled
    component'. The change method runs on every key stroke to update state, and
    this makes it very straightforward to modify or validate user input.
    See: https://reactjs.org/docs/forms.html */
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    /* In my submit function, first I retrieve my context from props and save
    it to a handy variable. Then I retrieve all the properties from state and
    save them to their own handy variables. */
    const { context } = this.props;
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    /* Check whether my password and my password confirmation match; if not,
    then I set the errors in state to an array containing the string,
    'Please confirm your password again' The return allows me to immediately
    exit out of the submit function before the user can be verified */
    if (password !== confirmPassword) {
      return this.setState({ errors: ['Please confirm your password again.']})
    }

    /* I create the object I'll hand to my createUser() method and set it to the
    handy variable user */
    const user = {
      firstName,
      lastName,
      emailAddress,
      password
    };

    /* Then I call my createUser() method from my Context API. If the response
    returns as an array, then there's been an error (I return errors as arrays
    in my Data component), and I set my errors property in state to the second
    item in my response array. If the response is NOT an array, then YAY, it's
    been successful, and I sign in my user with my signIn() method from my
    Context API. Then I return them to the home page. If anything else goes wrong,
    I log the error to the console.*/
    context.data.createUser(user)
       .then(response => {
          if (Array.isArray(response)) {
            this.setState({errors: response[1].error})
          } else {
            context.actions.signIn(emailAddress, password)
              .then(() => {
                this.props.history.push('/');
            });
          }
       })
       .catch((err) => {
         console.log(err);
       });

    }

    cancel = () => {
      //In my cancel method, I simply redirect the user to the home page.
      this.props.history.push('/');
    }
}
