import React from 'react';

export default (props) => {
  /* First I retrieve cancel, errors, submit, submitButtonText, and elements
  from the props I've passed to the form from my other components, and I save them
  to their own handy variables. */
  const {
    cancel,
    errors,
    submit,
    submitButtonText,
    elements,
  } = props;

  /*In my handleSubmit function, I prevent the default event from occurring (a
  page refresh), and I call the submit method from my props. */
  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  /*In my handleCancel function, I prevent the default event from occurring, and
  I call the cancel method from my props. */
  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <div>
      {/* I place the ErrorsDisplay function in its own component, and I pass it
        the errors from my props to display. */}
      <ErrorsDisplay errors={errors} />
      {/* Here I specify that the handleSubmit function I defined above should be
        executed on the form's submit event. */}
      <form onSubmit={handleSubmit}>
      {/* Here I display the elements I've passed down as props from my other
      components, like CreateCourse and UpdateCourse, etc. */}
        {elements()}
        <div className="pad-bottom">
          {/* Here I create the submit and cancel buttons and specify 1) that
            the submit button is of the submit type, and 2) that the handleCancel
            function I defined above should be executed on the button's click event.
          */}
          <button className="button" type="submit">{submitButtonText}</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function ErrorsDisplay({ errors }) {
  //In the ErrorsDisplay function, I first set the variable errorsDisplay to null.
  let errorsDisplay = null;

  //But if the errors array (the parameter of the function) has items in it,
  //then I display those items in an li element. 
  if (errors.length) {
    errorsDisplay = (
      <div>
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return errorsDisplay;
}
