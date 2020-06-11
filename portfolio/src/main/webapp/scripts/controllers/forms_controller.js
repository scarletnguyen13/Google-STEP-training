import { isSignedUpType, convertNewLineToBreakTag } from '../helpers.js';
import { login, signup } from './auth_controller.js';
import { requestComments } from './comments_controller.js';
import { renderCorrectFormForUser } from '../views/forms/forms.js';

firebase.auth().onAuthStateChanged(function(user) {
  renderCorrectFormForUser(user);
});

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

export { handleAuthSubmit, handleCommentSubmit }