import React, { Component } from 'react';

import Form from './Form.js';

export default class UpdateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    name: '',
    materialsNeeded: '',
    errors: []
  }

  async componentDidMount(){
    const { context } = this.props;
    const { match } = this.props;
    await context.data.getCourse(match.params.id)
      .then(course => {
        const studentName = `${course.User.firstName} ${course.User.lastName}`
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded
        } = course;

        this.setState({
          title,
          description,
          estimatedTime,
          materialsNeeded,
          studentName,
          course
        })
      });

    if (this.state.course.User.emailAddress !== context.authenticatedUser) {
      window.location.href = '/forbidden';
    }
  }

  render(){
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
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {

    const {context} = this.props;
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

    context.data.updateCourse(courseInfo, id, {emailAddress, password})
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({errors: response[1].error})
        } else {
          this.props.history.push(`/courses/${id}`);
        }
      }).catch(err =>{
        console.log(err);
      });
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
