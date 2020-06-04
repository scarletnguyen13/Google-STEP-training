import { DEFAULT_COMMENT_LIST_SIZE } from './constants.js';
import { renderCommentList } from './views/generate_comments.js';
import { app } from './firebase.js';

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
  const response = await fetch(`/comment?user=${user.uid}`, { method, body });
  const updatedComments = await response.json();
  if (updatedComments !== undefined) {
    commentList = updatedComments.slice();
    setSliderProps();
    formatCommentHeaderText(slider.value, updatedComments.length);
    renderCommentList(updatedComments.slice(0, slider.value));
  }
}

document.getElementById('hamburger-menu').onclick = function() {
  this.classList.toggle("change-shape"); // toggles between 3-bar and X shape
  this.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');
  requestComments('GET', null); // get all comments
};

document.getElementById('remove-button').onclick = function() {
  const message = 'Are you sure to delete ALL comments?';
  if (window.confirm(message)) {
    requestComments('DELETE', null);
  }
};

slider.oninput = function() {
  formatCommentHeaderText(this.value, commentList.length);
  renderCommentList(commentList.slice(0, this.value));
};

export { requestComments };