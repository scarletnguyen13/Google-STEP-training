import { ICONS, CONTENTS, GOOGLE_COLORS, TAG_COLORS, HEADERS } from '../constants.js';

const containerIds = ICONS.slice(1); // removes Contact

const createTag = (content, backgroundColor) => {
  const tag = document.createElement('div');
  tag.classList.add('center', 'tag');
  tag.style.backgroundColor = backgroundColor;
  tag.innerHTML = content;
  return tag;
}

const createLabel = (content, color) => {
  const label = document.createElement('label');
  label.className = 'label'
  label.innerHTML = content.startsWith('Skip') ? '' : content;
  label.style.color = color;
  return label;
}

const getColor = (list, i) => {
  return list[(i + 1) % list.length];
}

containerIds.map((id, index) => {
  const container = document.getElementById(id);
  const labelColor = getColor(GOOGLE_COLORS, index); 
  const tagColor = getColor(TAG_COLORS, index); 

  const header = document.createElement('h1');
  header.innerHTML = HEADERS[index];
  container.appendChild(header);

  for (let title in CONTENTS[index]) {
    const infoContainer = document.createElement('div');
    infoContainer.className = 'horizontal-container';

    const label = createLabel(title, labelColor);
    const tags = document.createElement('div');
    tags.className = 'horizontal-container';
    CONTENTS[index][title].map(content => {
      const tag = createTag(content, tagColor);
      tags.appendChild(tag);
    });

    infoContainer.appendChild(label);
    infoContainer.appendChild(tags);
    container.append(infoContainer);
  }
})