import React, { Component } from 'react';

import axios from 'axios';

class App extends Component {
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
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    return (
      <div>
        <div className="container">
          Hi!
        </div>
      </div>
    )
  }
};

export default App;
