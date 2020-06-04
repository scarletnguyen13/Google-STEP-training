import { signout } from '../../controllers/request_auth.js';
import { createButton } from './utils.js';

const createUserInfoContainer = () => {
  const user = firebase.auth().currentUser;
  const infoContainer = document.createElement('div');

  const headerText = document.createElement('h2');
  headerText.innerHTML = 'User';
  const emailText = document.createElement('p');
  emailText.innerHTML = `Email: ${user.email}`;
  const usernameText = document.createElement('p');
  usernameText.innerHTML = `Username: ${user.displayName}`;

  infoContainer.appendChild(headerText);
  infoContainer.appendChild(emailText);
  infoContainer.appendChild(usernameText);

  return infoContainer;
}

const createUserContainer = () => {
  const userContainer = document.createElement('div');
  userContainer.id = 'user-container';
  userContainer.className = 'horizontal-container margin-top-bot';
  
  const infoContainer = createUserInfoContainer();

  const logoutButton = createButton('Logout');
  logoutButton.addEventListener('click', signout);

  userContainer.appendChild(infoContainer);
  userContainer.appendChild(logoutButton);
  return userContainer;
}

export { createUserContainer };