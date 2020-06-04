import { requestComments } from './request_comments.js';
import { app } from './firebase.js';

const renderCorrectForm = async () => {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = '';
  firebase.auth().onAuthStateChanged(function(user) {
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
}

renderCorrectForm();

const createUserContainer = (email, username) => {
  const userContainer = document.createElement('div');
  userContainer.id = 'user-container';
  userContainer.className = 'horizontal-container margin-top-bot';
  
  const infoContainer = document.createElement('div');
  const headerText = document.createElement('h2');
  headerText.innerHTML = 'User';
  const emailText = document.createElement('p');
  emailText.innerHTML = `Email: ${email}`;
  const usernameText = document.createElement('p');
  usernameText.innerHTML = `Username: ${username}`;

  infoContainer.appendChild(headerText);
  infoContainer.appendChild(emailText);
  infoContainer.appendChild(usernameText);

  const logoutButton = createButton('Logout');
  logoutButton.onclick = function() {
    app.auth().signOut();
    renderCorrectForm();
  }

  userContainer.appendChild(infoContainer);
  userContainer.appendChild(logoutButton);
  return userContainer;
}

const createInput = (value) => {
  const input = document.createElement('input');
  const props = {
    id: value.toLowerCase(),
    name: value.toLowerCase(),
    className: 'comment-input',
    type: value.toLowerCase(),
    placeholder: value,
    required: true
  }
  Object.assign(input, props);
  return input;
}

const handleError = (error) => {
  alert(error.code);
  alert(error.message);
}

const signup = async (email, password, username) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(result) {
      result.user.updateProfile({ displayName: username })
    })
    renderCorrectForm();
  } catch (error) {
    handleError(error);
  }
}

const login = async (email, password) => {
  try {
    await app
      .auth()
      .signInWithEmailAndPassword(email, password);
    renderCorrectForm();
  } catch (error) {
    handleError(error);
  }
}

const renderForm = (value) => {
  const form = createAuthForm(value);
  const formContainer = document.getElementById('form-container');
  formContainer.removeChild(formContainer.lastChild);
  formContainer.appendChild(form);
}

const createAuthSelect = () => {
  const authSelect = document.createElement('select');
  authSelect.id = 'auth-select';
  const options =  ['Login', 'Signup'];
  options.map(opt => {
    const option = document.createElement('option');
    option.innerHTML = opt;
    authSelect.appendChild(option);
  })
  authSelect.value = options[0];
  authSelect.onchange = function() {
    renderForm(this.value);
  }
  return authSelect;
}

const createAuthForm = (type) => {
  const loginForm = document.createElement('form');
  loginForm.id = 'login-form';
  if (type === 'Signup') {
    loginForm.appendChild(createInput('Username'));
  }
  loginForm.appendChild(createInput('Email'));
  loginForm.appendChild(createInput('Password'));
  loginForm.appendChild(createButton(type));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      if (type === 'Signup') {
        signup(
          form.email.value, 
          form.password.value, 
          form.username.value
        );
      } else {
        login(form.email.value, form.password.value);
      }
    }
  });

  return loginForm;
}

const createTextarea = () => {
  const textarea = document.createElement('textarea');
  const props = {
    className: 'comment-input',
    id: 'comment-textarea',
    name: 'comment',
    placeholder: 'Type something...',
    rows: 3,
    required: true
  }
  Object.assign(textarea, props);
  return textarea;
}

const createButton = (value) => {
  const sendButton = document.createElement('input');
  const props = {
    id: value.toLowerCase(),
    className: 'comment-button', 
    type: 'submit', 
    value
  }
  Object.assign(sendButton, props);
  return sendButton;
}

const createCommentForm = () => {
  const commentForm = document.createElement('form');
  commentForm.id = 'comment-form';
  commentForm.appendChild(createTextarea());
  commentForm.appendChild(createButton('Send'));
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      const formData = new FormData();
      const user = firebase.auth().currentUser;
      formData.append("username", user.displayName);
      formData.append("content", form.comment.value.replace(/\n/g, "<br />"));
      requestComments('POST', formData); // create new comment
      form.reset();
    }
  });
  return commentForm;
}