import { PERSONAL_INFO } from './constants.js';

const myInfoContainer = document.getElementById('me');

const createTag = (content) => {
  const tag = document.createElement('div');
  tag.classList.add('center', 'description');
  tag.innerHTML = content;
  return tag;
}

const createLabel = (content) => {
  const label = document.createElement('label');
  label.className = "label"
  label.innerHTML = `${content}: `;
  return label;
}

for (let title in PERSONAL_INFO) {
  const infoContainer = document.createElement('div');
  infoContainer.className = "horizontal-container";

  const label = createLabel(title);
  const tags = document.createElement('div');
  tags.className = "horizontal-container";
  PERSONAL_INFO[title].map(content => {
    const tag = createTag(content);
    tags.appendChild(tag);
  });

  infoContainer.appendChild(label);
  infoContainer.appendChild(tags);
  myInfoContainer.append(infoContainer);
}