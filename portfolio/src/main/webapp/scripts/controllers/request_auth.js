const handleError = (error) => {
  alert(error.code);
  alert(error.message);
}

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
    handleError(error);
  }
}

const login = async (email, password) => {
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (error) {
    handleError(error);
  }
}

export { login, signup, signout };