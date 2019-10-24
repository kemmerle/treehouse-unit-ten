import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component{
  //Here I set the initial state of the component and give it three properties:
  //course (an empty array), studentName, an empty string, and authorizedUser, a
  //boolean set to false.
  state = {
    course: [],
    studentName: '',
    authorizedUser: false
  }

  async componentDidMount(){
    //When the component loads in the browser or the page refreshes...
    //I retrieve my context from props and save it to a handy variable.
    const { context } = this.props;

    //First I call my getCourse() method, stored in my Context.
    await context.data.getCourse(this.props.match.params.id)
    .then(response => {
      //If context returns an authenticated user....
      if (context.authenticatedUser != null) {
        //And if the authenticated user owns the course...
        if (context.authenticatedUser.id  === response.User.id) {
          //then I set authorizedUser to true in state.
          this.setState({
            authorizedUser: true
          });
        } else {
          //If the authenticated user does not own the course, I set authorizedUser
          //to false in state.
          this.setState({
            authorizedUser: false
          });
        }
      }
      //No matter whether the user is authorized or not, I need to set my course
      //property in state to the API's response, and I set my studentName property.
      this.setState({
        course: response,
        studentName: `${response.User.firstName} ${response.User.lastName}`
      })
    })
  }

  render(){
    //In my render, first I retrieve my context from props and save it to a handy
    //variable. Then I retrieve course, studentName, and authorizedUser from states
    //and save them to their own handy variables.
    const { context } = this.props;
    let { course, studentName, authorizedUser } = this.state;
    //I declare emailAddress and password, so they are accessible outside of the
    //conditional.
    let emailAddress;
    let password;
    //If the authorizedUser returns as true, I set the variables emailAddress and
    //the password to the email address and password associated with the authenticated
    //user in my context. I need this information to send my DELETE request for
    //the course.
    if (authorizedUser) {
      emailAddress = context.authenticatedUser.emailAddress
      password = context.authenticatedUserPassword
    }
    return(
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {/* If the authorizedUser property in state returns as true, I
                render the Update and Delete buttons, so that the course owner can
                edit course information or delete it. If the user does not own
                the course, then I render an empty span tag. */}
              {authorizedUser ?
                <span>
                  <Link
                    className="button"
                    to={`/courses/${this.props.match.params.id}/update`}
                  >
                    Update Course
                  </Link>
                  <button
                    className="button"
                    onClick={()=>context.data.deleteCourse(course.id, {emailAddress, password})
                      .then(()=> this.props.history.push('/'))}>
                    Delete Course
                  </button>
                </span>
              :
                <span></span>
              }
               <Link
                 className="button button-secondary"
                 to="/">Return to List
               </Link>
            </div>
          </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
            <p>By {studentName}</p>
          </div>
        <div className="course--description">
          {/* I use ReactMarkdown to render the course description and the materials
            needed for the course. */}
          <ReactMarkdown source={course.description} />
        </div>
      </div>
      <div className="grid-25 grid-right">
        <div className="course--stats">
          <ul className="course--stats--list">
            <li className="course--stats--list--item">
              <h4>Estimated Time</h4>
              <h3>{course.estimatedTime}</h3>
            </li>
            <li className="course--stats--list--item">
              <h4>Materials Needed</h4>
           <ul>
             <ReactMarkdown source={course.materialsNeeded} />
           </ul>
            </li>
           </ul>
          </div>
         </div>
        </div>
      </div>
    )
  }
}
