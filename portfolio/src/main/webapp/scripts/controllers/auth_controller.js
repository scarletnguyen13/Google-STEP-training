import { displayError } from '../views/forms/utils.js';

const signout = async () => {
  await firebase.auth().signOut();
}

const signup = async (email, password, username) => {
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        result.user.updateProfile({ displayName: username })
      });
  } catch (error) {
    displayError(error.message);
  }
}

const login = async (email, password) => {
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (error) {
    displayError(error.message);
  }
}

export { login, signup, signout };