import { DEFAULT_COMMENT_LIST_SIZE } from '../constants.js';
import { renderCommentList } from '../views/comments.js';
import { displayError } from '../views/forms/utils.js';

const slider = document.getElementById('comment-slider');
let commentList = [];

const getCorrectListSize = (listLength) => {
  return listLength < DEFAULT_COMMENT_LIST_SIZE ? 
    listLength : 
    DEFAULT_COMMENT_LIST_SIZE
}

const setSliderProps = () => {
  const defaultLength = getCorrectListSize(commentList.length);
  slider.max = commentList.length;
  if (slider.value === "0") {
    slider.value = defaultLength;
  }
}

/**
 * @param {number} outOf
 * @param {number} total
 */
const formatCommentHeaderText = (outOf, total) => {
  document.getElementById('comment-header-text').innerHTML = 
    `Comments (${outOf}/${total})`;
}

/**
 * @param {string} method
 * @param {string} body
 */
const requestComments = async (method, body) => {
  const user = firebase.auth().currentUser;
  let url = '/comment';
  if (user !== null) {
    const tokenId = await user.getIdToken(/* forceRefresh */ true);
    url += `?id=${tokenId}`;
  }
  const response = await fetch(url, { method, body });
  const text = await response.text();
  handleResponse(text);
}

const handleResponse = response => {
  if (response !== undefined) {
    if (response.startsWith("Failed")) {
      displayError(response);
    } else {
      const updatedComments = JSON.parse(response);
      commentList = updatedComments.slice();
      setSliderProps();
      formatCommentHeaderText(slider.value, updatedComments.length);
      renderCommentList(updatedComments.slice(0, slider.value));
    } 
  }
}

document.getElementById('hamburger-menu').onclick = function() {
  this.classList.toggle("change-shape"); // toggles between 3-bar and X shape
  this.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');
  requestComments('GET', null); // get all comments, null = no body attached in request
};

document.getElementById('remove-button').onclick = function() {
  const message = 'Are you sure to delete ALL comments?';
  if (window.confirm(message)) {
    requestComments('DELETE', null); // null = no body attached in request
  }
};

slider.oninput = function() {
  formatCommentHeaderText(this.value, commentList.length);
  renderCommentList(commentList.slice(0, this.value));
};

export { requestComments };