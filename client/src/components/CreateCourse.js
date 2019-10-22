import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: []
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;
    const { context } = this.props;
    const studentName = `${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`

    return (
        <div className="bounds course--detail">
          <h1>Create Course</h1>
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
      const {title, description, estimatedTime, materialsNeeded} = this.state;
      const {emailAddress} = context.authenticatedUser;
      const password = context.authenticatedUserPassword;
      const course = {
        title,
        description,
        estimatedTime,
        materialsNeeded
    }

    context.data.createCourse(course, {emailAddress, password})
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({errors: response[1].error})
        } else {
          console.log(`Success!- ${title} is succesfully Created!`);
          this.props.history.push('/');
        }
      }).catch(err =>{
        console.log(err);
      });
    }

    cancel = () => {
      this.props.history.push('/');
    }
}
