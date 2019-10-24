import config from './config';

export default class Data {

  /* First I write a function named api, in which I configure API calls. It takes
  five parameters: the url path which we'll add to our base url to make the API
  call, the method (default is GET), a body (default is 'null'),
  requiresAuth (a boolean, defaulted to false), and credentials (defaulted to
  null). */
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    //Here I configure the url to which I'll make my API call and the options I will
    //attach to that call.
    const url = config.apiBaseUrl + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    //If the body parameter is not null, then I add body as a property of my options
    //variable.
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    //If the requiresAuth parameter is set to true, I set the encodedCredentials
    //variable and add to the headers property of my options variable.
    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    //Finally, I return a fetch call with the url and options configured above
    //as its parameters.
    return fetch(url, options);
  }

  /* In my getUser method (asynchronous, because it is an API call), I first
  call my API endpoint and set its response to the variable response.
  If the response status is 200 (the call is successful), I return the response
  in JSON format. If any other inexplicable error is returned, I redirect the
  client to the '/error' route. */
  async getUser(emailAddress, password) {
    const response = await this.api('/users', 'GET', null, true, {emailAddress, password});
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 401) {
      return null;
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my createUser method (asynchronous, because it is an API call; user, ie. the
  required user information, is the one parameter), I first call my API endpoint
  and set its response to the variable response. If the response status is 201
  (the user is created), I simply return null. If the request is bad (Status 400),
  I return an array with the response status and an errors array. If any other
  inexplicable error is returned, I redirect the client to the '/error' route. */
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return null;
    } else if (response.status === 400) {
      const errors = await response.json();
      return [response.status, errors];
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my getCourses method (asynchronous, because it is an API call), I first
  call my API endpoint and set its response to the variable response.
  If the response status is 200 (the call is successful), I return the response
  in JSON format. If any other inexplicable error is returned, I redirect the
  client to the '/error' route. */
  async getCourses(){
    const response = await this.api('/courses', 'GET', null);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my getCourse method (asynchronous, because it is an API call; the course
  id is the one paramter), I first call my API endpoint and set its response to
  the variable response. If the response status is 200 (the call is successful),
  I return the response in JSON format. If the course is not found (Status code 404),
  I redirect the client to the '/notfound' route. If any other inexplicable error
  is returned, I redirect the client to the '/error' route. */
  async getCourse(id) {
    const response = await this.api(`/courses/${id}`, 'GET', null);
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      window.location.href = '/notfound';
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my createCourse method (asynchronous, because it is an API call), there
  are two parameters: the required course information (an object) and the credentials
  of the course owner (the email address and password, also an object). I first
  call my API endpoint and set its response to the variable response. If the
  response status is 201 (the course is created), I simply return null. If the
  request is bad (Status 400), I return an array with the response status and an
  errors array. If any other inexplicable error is returned, I redirect the client
  to the '/error' route. */
  async createCourse(course, {emailAddress, password}) {
    const response = await this.api('/courses/', 'POST', course, true, {emailAddress, password});
    if (response.status === 201) {
      return null;
    } else if (response.status === 400) {
      const errors = await response.json();
      return [response.status, errors];
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my updateCourse method (asynchronous, because it is an API call), there
  are three parameters: the required course information (an object), the course id,
  and the credentials of the course owner (the email address and password, also
  an object). I first call my API endpoint and set its response to the variable
  response. If the response status is 204 (the course is updated), I simply return
  null. If the request is bad (Status 400), I return an array with the response
  status and an errors array. If any other inexplicable error is returned, I
  redirect the client to the '/error' route. */
  async updateCourse(course, id, {emailAddress, password}) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, {emailAddress, password});
    if (response.status === 204) {
      return null;
    } else if (response.status === 400) {
      const errors = await response.json();
      return [response.status, errors];
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }

  /* In my deleteCourse method (asynchronous, because it is an API call), there
  are two parameters: the course id, and the credentials of the course owner
  (the email address and password, an object). I first call my API endpoint and
  set its response to the variable response. If the response status is 204 (the
  course is deleted), I simply return null. If any other inexplicable error is
  returned, I redirect the client to the '/error' route. */
  async deleteCourse(id, {emailAddress, password}) {
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {emailAddress, password});
    if (response.status === 204) {
      return null;
    } else if (response.status === 500) {
      window.location.href = '/error';
    } else {
      window.location.href = '/error';
    }
  }
}
