import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetails extends Component{
  state = {
    course: [],
    studentName: '',
    authorizedUser: false
  }

  async componentDidMount(){
    const { context } = this.props;
    const { match } = this.props;
    await context.data.getCourse(match.params.id)
    .then(response => {
      if(response === 404){
        return this.props.history.push('/notfound')
      }
      if (context.authenticatedUser != null) {
        if (context.authenticatedUser.id  === response.User.id) {
          this.setState({
            authorizedUser: true
          });
        } else {
          this.setState({
            authorizedUser: false
          });
        }
      }
      this.setState({
        course: response,
        studentName: `${response.User.firstName} ${response.User.lastName}`
      })
    })
  }

  render(){
    const { context } = this.props;
    const { match } = this.props;
    let { course, studentName, authorizedUser } = this.state;
    let emailAddress;
    let password;
    if(authorizedUser){
      emailAddress = context.authenticatedUser.emailAddress
      password = context.authenticatedUserPassword
    }
    return(
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {authorizedUser ?
                <span>
                  <Link
                    className="button"
                    to={`/courses/${match.params.id}/update`}
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
