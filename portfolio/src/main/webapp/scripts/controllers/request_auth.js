import { renderCorrectForm } from '../views/forms/forms.js';

renderCorrectForm();

const handleError = (error) => {
  alert(error.code);
  alert(error.message);
}

const signout = async () => {
  await firebase.auth().signOut();
  renderCorrectForm();
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
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    renderCorrectForm();
  } catch (error) {
    handleError(error);
  }
}

export { login, signup, signout };