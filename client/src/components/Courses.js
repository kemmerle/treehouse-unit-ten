import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CourseTile from './CourseTile';

export default class Courses extends Component {
  /* Here I set the initial state of the component and give it one property:
  courses (an empty array), where I'll hold all the information for my courses. */
  constructor() {
    super();
    this.state = {
      courses: []
    }
  }

  componentDidMount(){
    //When the component loads in the browser or the page refreshes...
    //I retrieve my context from props and save it to a handy variable.
    const { context } = this.props;

    /* I call my getCourses() method, stored in my Context, to collect my courses
    data. */
    context.data.getCourses()
    .then(courses => {
      //If the request is successful, then I store the response in state as courses.
      this.setState({
        courses
      })
    })
  };

  render(){
      return(
        <div className="bounds">

          {/* I map over my courses property in state. For each course, I create
            a CourseTile component. */}
          {this.state.courses.map((course)=>
            <CourseTile
              title={course.title}
              key={course.id}
              id={course.id}
            />
          )}

          <div className="grid-33">
            <Link className="course--module course--add--module" to="/courses/create">
              <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                  <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                </svg>New Course</h3>
            </Link>
          </div>
        </div>

      );
    };
};
