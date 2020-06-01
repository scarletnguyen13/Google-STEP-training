import { convertMillisecondsToLocaleString } from './helpers.js';

let comments = [
  // Mock Data
  {
    "content": "I went here to write some random thoughts",
    "timestamp": 1591035530066,
    "username": "Rough Bush"
  }
];

const hamburgerMenu = document.getElementById('hamburger-menu');
const commentList = document.getElementById('comment-list');

hamburgerMenu.addEventListener('click', async () => {
  hamburgerMenu.classList.toggle("change");
  hamburgerMenu.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');

  if (hamburgerMenu.classList.contains('visible')) {
    const response = await fetch('/comment');
    const updatedComments = await response.json();
    comments = updatedComments;
  }
});

document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);

  const response = await fetch('/comment', {
    method: 'POST',
    body: data,
  });
  const updatedComments = await response.json();
  comments = updatedComments;
});

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

comments.map((comment) => {
  const commentContainer = createCommentContainer(comment);
  commentList.prepend(commentContainer);
})