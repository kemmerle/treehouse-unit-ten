import React, { Component } from 'react';

import Courses from './components/Courses';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userData: {}
    }
  }

  componentDidMount() {
    this.userLoad();
  }

  //https://gist.github.com/ivermac/922def70ed9eaf83799b68ab1a587595
  //https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
  //https://stackoverflow.com/questions/44523030/cannot-read-property-setstate-of-undefined-with-fetch-api
  userLoad = () => {
    let username = 'joe@smith.com';
    let password = 'joepassword';
    let url = `http://localhost:5000/api/users`
    let authString = `${username}:${password}`
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(authString))
    fetch(url,{method: 'GET', headers: headers})
    .then(response => {
      return response.json();
    })
    .then(user => {
      this.setState({ userData: user });
      console.log(this.state.userData);
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          < Courses />
        </div>
      </div>
    )
  }
};

export default App;
