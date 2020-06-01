let comments = [
  // Mock Data
  {
    "content": "I went here to write some random thoughts",
    "timestamp": 1591035530066,
    "username": "Rough Bush"
  }
];

const hamburgerMenu = document.getElementById('hamburger-menu');

hamburgerMenu.addEventListener('click', async () => {
  hamburgerMenu.classList.toggle("change");
  hamburgerMenu.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');

  if (hamburgerMenu.classList.contains('visible')) {
    console.log("when click burger");
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

const convertMillisecondsToLocaleString = (milliseconds) => {
  const date = new Date(milliseconds);
  return date.toLocaleDateString();
}

const createCommentHeader = (comment) => {
  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const profileImage = document.createElement('img');
  profileImage.className = 'profile-image';
  profileImage.src = '../images/profile-placeholder.png';
  profileImage.alt = "Profile Placeholder";

  const usernameText = document.createElement('b');
  usernameText.innerHTML = comment.username;

  const createdAtText = document.createElement('p');
  createdAtText.innerHTML = 
    convertMillisecondsToLocaleString(comment.timestamp);

  commentHeader.appendChild(profileImage);
  commentHeader.appendChild(usernameText);
  commentHeader.appendChild(createdAtText);

  return commentHeader;
}

const commentList = document.getElementById('comment-list');

comments.map((comment) => {
  const commentContainer = document.createElement('li');
  commentContainer.className = 'comment';

  const commentHeader = createCommentHeader(comment);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = `> ${comment.content}`;

  commentContainer.appendChild(commentHeader);
  commentContainer.appendChild(commentBody);

  commentList.prepend(commentContainer);
})