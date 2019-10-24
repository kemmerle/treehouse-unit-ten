import React, { Component } from 'react';

import Form from './Form';

export default class CreateCourse extends Component {
  /* Here I set the initial state of the component and give it five properties.
  The course details are all set to empty strings: title, description,
  estimatedTime, and materialsNeeded. The errors property is set to an empty array
  and will only be set to a value in the event that validation errors occur.*/
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: []
  }

  render() {
    /* In my render, first I retrieve my context from props and save it to a handy
    variable. Then I retrieve title, description, estimatedTime, and materialsNeeded
    from state and save them to their own handy variables. */
    const { context } = this.props;
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;
    /* I create the studentName variable from the authenticated user stored in Context;
    the course owner's name will appear in the paragraph tag. */
    const studentName = `${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`

    return (
        <div className="bounds course--detail">
          <h1>Create Course</h1>
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
            submitButtonText="Create Course"
            elements={() => (
              <React.Fragment>
                <div className="grid-66">
                  <div className="course--header">
                  <h4 className="course--label">Course</h4>
                    <input
                      id="title"
                      name="title"
                      className="input-title course--title--input"
                      type="text"
                      value={title}
                      onChange={this.change}
                      placeholder="Course Title..." />
                    <p>by {studentName}</p>
                  </div>
                  <div className="course--description">
                    <textarea
                      id="description"
                      name="description"
                      type="text"
                      value={description}
                      onChange={this.change}
                      placeholder="Course Description..."
                    />
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <input
                          id= "estimatedTime"
                          name = "estimatedTime"
                          type="text"
                          value={estimatedTime}
                          onChange={this.change}
                          placeholder="Hours"
                        />
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <textarea
                          id="materialsNeeded"
                          name="materialsNeeded"
                          type="text"
                          value={materialsNeeded}
                          onChange={this.change}
                          placeholder="Materials Needed..."
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
            )}
          />
        </div>
    )
  };

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
      it to a handy variable. Then I retrieve title, description, estimatedTime,
      and materialsNeeded from state and save them to their own handy variables.
      Finally, I retrieve the email address and password of the authenticated user
      from context. I will need both to make a call to my REST API to create a
      course. */
      const {context} = this.props;
      const {
        title,
        description,
        estimatedTime,
        materialsNeeded
      } = this.state;
      const {emailAddress} = context.authenticatedUser;
      const password = context.authenticatedUserPassword;

      /*I write a handy course variable, so I can easily pass it to my createCourse
      method. */
      const course = {
        title,
        description,
        estimatedTime,
        materialsNeeded
      }

      ///I call my createCourse() method, stored in my Context.
      context.data.createCourse(course, {emailAddress, password})
        .then(response => {
          //I check whether the response is an array, since this is how I have
          //stored my errors.
          if (Array.isArray(response)) {
            //If there are errors, I set the errors property to the value of the
            //second item in the response array.
            this.setState({errors: response[1].error})
          } else {
            //If the call is successful, I redirect the client to the home page.
            this.props.history.push('/');
          }
        }).catch(err =>{
          //If there are any other errors, I log them to the console.
          console.log(err);
        });
    }

    cancel = () => {
      //In my cancel method, I simply redirect the user to the home page. 
      this.props.history.push('/');
    }
}
