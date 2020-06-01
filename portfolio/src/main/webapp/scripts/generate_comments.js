
const hamburgerMenu = document.getElementById('hamburger-menu');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle("change");
  hamburgerMenu.classList.toggle("visible");
  document.getElementById('comments-container').classList.toggle('visible');
});

// document.getElementById('logo-text').addEventListener('click', async function() {
//   const response = await fetch('/data');
//   const data = await response.text();
//   document.getElementById('logo-text').innerText = data;
// });

const FAKE_COMMENTS = [
  {
    createdAt: 'Fri',
    body: 'My first comment!'
  }
]

const createCommentHeader = (index, createdAt) => {
  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const profileImage = document.createElement('img');
  profileImage.className = 'profile-image';
  profileImage.src = '../images/profile-placeholder.png';
  profileImage.alt = "Profile Placeholder";

  const orderText = document.createElement('p');
  orderText.innerHTML = `Comment #${index + 1}`;

  const createdAtText = document.createElement('p');
  createdAtText.innerHTML = comment.createdAt;

  commentHeader.appendChild(profileImage);
  commentHeader.appendChild(orderNo);
  commentHeader.appendChild(createdAt);

  return commentHeader;
}

const commentList = document.getElementById('comment-list');

COMMENTS.map((comment, index) => {
  const commentContainer = document.createElement('li');
  commentContainer.className = 'comment';

  const commentHeader = createCommentHeader(index, comment.createdAt);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = `> ${comment.body}`;

  commentContainer.appendChild(commentHeader);
  commentContainer.appendChild(commentBody);

  commentList.prepend(commentContainer);
})