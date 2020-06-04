import { requestComments } from '../../controllers/request_comments.js';
import { login, signup } from '../../controllers/request_auth.js';
import { createUserContainer } from './user_info.js';
import { createAuthSelect } from './auth_select.js';
import { createInput, createTextarea, createButton } from './utils.js';
import { convertNewLineToBreakTag } from '../../helpers.js';

firebase.auth().onAuthStateChanged(function(user) {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = '';
  if (user) {
    formContainer.appendChild(
      createUserContainer(user.email, user.displayName)
    );
    formContainer.appendChild(createCommentForm());
  } else {
    formContainer.appendChild(createAuthSelect());
    formContainer.appendChild(createAuthForm('Login'));
  }
});

const isSignedUpType = (type) => {
  return type === 'Signup';
}

const handleAuthSubmit = (form, type) => {
  if (form.checkValidity()) {
    const { email, password, username } = form;
    if (isSignedUpType(type)) {
      signup(email.value, password.value, username.value);
    } else {
      login(email.value, password.value);
    }
  }
}

const createAuthForm = (type) => {
  const authForm = document.createElement('form');
  authForm.id = 'auth-form';
  if (isSignedUpType(type)) {
    authForm.appendChild(createInput('Username'));
  }
  authForm.appendChild(createInput('Email'));
  authForm.appendChild(createInput('Password'));
  authForm.appendChild(createButton(type));

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuthSubmit(e.currentTarget, type);
  });

  return authForm;
}

const handleCommentSubmit = (form) => {
  if (form.checkValidity()) {
    const formData = new FormData();
    const user = firebase.auth().currentUser;
    formData.append("username", user.displayName);
    formData.append("content", convertNewLineToBreakTag(form.comment.value));
    requestComments('POST', formData); // create new comment
    form.reset();
  }
}

const createCommentForm = () => {
  const commentForm = document.createElement('form');
  commentForm.id = 'comment-form';
  commentForm.appendChild(createTextarea());
  commentForm.appendChild(createButton('Send'));
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCommentSubmit(e.currentTarget);
  });
  return commentForm;
}

export { createAuthForm };
