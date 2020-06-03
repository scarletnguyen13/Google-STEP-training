import { convertMillisecondsToLocaleString } from './helpers.js';
import { DEFAULT_COMMENT_LIST_SIZE } from './constants.js';

/** @returns {Element} */
const createProfileImage = () => {
  const profileImage = document.createElement('img');
  profileImage.className = 'profile-image';
  profileImage.src = '../images/profile-placeholder.png';
  profileImage.alt = "Profile Placeholder";
  return profileImage;
}

/**
 * @param {long} timestamp
 * @param {string} username
 * @returns {Element} 
 */
const createCommentHeader = (timestamp, username) => {
  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const profileImage = createProfileImage();

  const usernameText = document.createElement('b');
  usernameText.innerHTML = username;

  const createdAtText = document.createElement('p');
  createdAtText.innerHTML = 
    convertMillisecondsToLocaleString(timestamp);

  commentHeader.appendChild(profileImage);
  commentHeader.appendChild(usernameText);
  commentHeader.appendChild(createdAtText);

  return commentHeader;
}

/**
 * @param {string} content
 * @returns {Element} 
 */
const createCommentBody = (content) => {
  const commentBody = document.createElement('p');
  commentBody.innerHTML = `> ${content}`;
  return commentBody;
}

/**
 * @param {object} comment
 * @param {long} comment.timestamp
 * @param {string} comment.username
 * @param {string} comment.content
 * @returns {Element} 
 */
const createCommentContainer = (comment) => {
  const { timestamp, username, content } = comment;
  const commentContainer = document.createElement('li');
  commentContainer.className = 'comment';

  const commentHeader = createCommentHeader(timestamp, username);
  const commentBody = createCommentBody(content);

  commentContainer.appendChild(commentHeader);
  commentContainer.appendChild(commentBody);

  return commentContainer;
}

/** @param {Array.object} comments responded objects from API */
const renderCommentList = (comments) => {
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = '';
  comments.map((comment) => {
    const commentContainer = createCommentContainer(comment);
    commentList.appendChild(commentContainer);
  })
}

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
  const response = await fetch('/comment', { method, body });
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
    emptyCommentList();
    formatCommentHeaderText(0, 0);
    requestComments('DELETE', null);
  }
};

const emptyCommentList = () => {
  document.getElementById('comment-list').innerHTML = '';
  commentList = [];
  slider.max = 0;
  renderCommentList(commentList);
}

slider.oninput = function() {
  formatCommentHeaderText(this.value, commentList.length);
  renderCommentList(commentList.slice(0, this.value));
};

document.getElementById('comment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.checkValidity()) {
    requestComments('POST', form.comment.value); // create new comment
    form.reset();
  }
});