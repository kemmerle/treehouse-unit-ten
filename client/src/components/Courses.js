import React, { Component } from 'react';

import axios from 'axios';

class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: []
    }
  }

  componentDidMount() {
    this.courseLoad()
  }

  courseLoad = () => {
    axios.get(`http://localhost:5000/api/courses`)
      .then(response => {
        this.setState({
          courses: response.data
        });
        console.log(this.state.courses);
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render(){
      return(
        <div className="bounds">

        {this.state.courses.map((course)=>
          <div className="grid-33" key={course.id}>
            <a className="course--module course--link" href={`/courses/${course.id}`}>
            <h3 className="course--title">{course.title}</h3>
            </a>
          </div>
        )}

        <div className="grid-33"><a className="course--module course--add--module" href="/courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </a></div>
        </div>

      );
    };
};

export default Courses;
