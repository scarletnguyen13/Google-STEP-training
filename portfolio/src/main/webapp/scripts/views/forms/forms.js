import { createUserContainer } from './user_info.js';
import { createAuthSelect } from './auth_select.js';
import { createInput, createTextarea, createButton } from './utils.js';
import { isSignedUpType } from '../../helpers.js';
import { handleAuthSubmit, handleCommentSubmit } from '../../controllers/forms_controller.js';

const renderCorrectFormForUser = (user) => {
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

export { renderCorrectFormForUser, createAuthForm };
