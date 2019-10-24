import React, { Component } from 'react';

import Form from './Form.js';

export default class UpdateCourse extends Component {
  /* Here I set the initial state of the component and give it six properties.
  I've initially set the course information and studentName to empty strings, and
  and I've set errors to an empty array. I struggled the most with this component,
  and I determined that I could not simply store 'course' in my initial state. I
  needed to separate out each of the course properties to better control them in
  the form and display them properly. */
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    studentName: '',
    errors: []
  }

  async componentDidMount(){
    //When the component loads in the browser or the page refreshes...
    //I retrieve my context from props and save it to a handy variable.
    const { context } = this.props;

    //First I call my getCourse() method, stored in my Context.
    await context.data.getCourse(this.props.match.params.id)
    //If the response is successful...
    /* Here I separate out each of the properties of the course returned from the API
    and set them to their own handy variables. */
      .then(course => {
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded
        } = course;
        /* Here I set the studentName variable to the course owner's first and
        last name. It was virtually impossible to display the name correctly
        otherwise. I had to set it in state on my initial call to the API, or I
        kept running into a recurring error. */
        const studentName = `${course.User.firstName} ${course.User.lastName}`

        /* Here I set all my properties in state to those I've saved above from my
        API. I've saved course as the last property in state, so that I can
        retrieve the course's owner and compare it with the authenticated user
        in the conditional below (I will also use the course property in my
        submit function below */
        this.setState({
          title,
          description,
          estimatedTime,
          materialsNeeded,
          studentName,
          course
        })
      });

      /* In this conditional, I check whether the course's owner is also the user
      currently logged in. If not, I redirect the client to the '/forbidden'
      route. I can only complete this once I've set state. */
      if (this.state.course.User.id !== context.authenticatedUser.id) {
        this.props.history.push('/forbidden');
      }
  }

  render(){
    /* In my render, first I retrieve the course details and my errors array (if
    there is one) from state, and I save them to their own handy variables. */
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      studentName,
      errors
    } = this.state;

    return(
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        {/* I pass my form down five props:
          1) cancel, which holds the cancel function I have defined below;
          2) errors, the errors array held in state in case of validation errors;
          3) submit, which holds the submit function I have defined below;
          4) the text for the submit button,
          5) and the elements (ie. the input fields) that the form will hold.
          I use React Fragments because 'Fragments let you group a list of
          children without adding extra nodes to the DOM.'
           See: https://reactjs.org/docs/fragments.html */}
        {/* To ensure that each of my input fields displays the course details
          that have already been submitted, I assign the appropriate course
          detail stored in state as the value of each input field. */}
        <div>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update Course"
            elements={() => (
              <React.Fragment>
              <div className="grid-66">
                <div className="course--header">
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
                        id="estimatedTime"
                        name="estimatedTime"
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
      </div>
    )
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
    it to a handy variable. Then I retrieve title, description, estimatedTime,
    and materialsNeeded from state and save them to their own handy variables.

    Then I retrieve the information I'll need to make my API request: the course
    id, which I've pulled from state, and the email address and password of the
    authenticated user stored in Context. Finally, I save all of my course details
    to the courseInfo variable, so I can easily pass it to my updateCourse method.
    */
    const { context } = this.props;
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;
    const {id} = this.state.course;
    const {emailAddress} = context.authenticatedUser;
    const password = context.authenticatedUserPassword;
    const courseInfo = {
      title,
      description,
      estimatedTime,
      materialsNeeded
    }

    ///I call my updateCourse() method, stored in my Context.
    context.data.updateCourse(courseInfo, id, {emailAddress, password})
      .then(response => {
        //I check whether the response is an array, since this is how I have
        //stored my errors.
        if (Array.isArray(response)) {
          //If there are errors, I set the errors property to the value of the
          //second item in the response array.
          this.setState({errors: response[1].error})
        } else {
          //If the call is successful, I redirect the client to the course's page.
          this.props.history.push(`/courses/${id}`);
        }
      }).catch(err =>{
        //If there are any other errors, I log them to the console.
        console.log(err);
      });
  }

  cancel = () => {
      //In my cancel method, I simply redirect the user to the course page. 
    const {id} = this.state.course;
    this.props.history.push(`/courses/${id}`);
  }
}
