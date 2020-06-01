import { convertMillisecondsToLocaleString } from './helpers.js';

const hamburgerMenu = document.getElementById('hamburger-menu');
const commentList = document.getElementById('comment-list');

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

const renderCommentList = (comments) => {
  commentList.innerHTML = '';
  comments.map((comment) => {
    const commentContainer = createCommentContainer(comment);
    commentList.prepend(commentContainer);
  })
}

/**
 * @param {string} action
 * @param {FormData} formData
 */
const fetchComments = async (action, data) => {
  const response = await fetch('/comment', {
    method: action,
    body: data,
  });
  const updatedComments = await response.json();
  if (updatedComments !== undefined) {
    renderCommentList(updatedComments);
  }
}

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle("change");
  hamburgerMenu.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');
  fetchComments('GET', null);
});

document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.checkValidity()) {
    fetchComments('POST', form.comment.value);
    form.reset();
  }
});