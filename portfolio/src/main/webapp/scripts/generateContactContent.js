import { CONTACT } from './constants.js';

const contactContainer = document.getElementById('contact');

const createAnchor = (url) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = "_blank";
  return anchor;
}

const createSvgIcon = (type) => {
  const icon = document.createElement('img');
  icon.className = 'svg';
  // cbc icon is slightly darker than other icons, thus no filter needed
  if (type !== 'cbc') { 
    icon.id = 'filter';
  }
  icon.src = `./images/contact-icons/${type}.svg`;
  return icon;
}

export function generateContactContent() {
  for (let type in CONTACT) {
    const anchor = createAnchor(CONTACT[type]);
    const icon = createSvgIcon(type);
    anchor.appendChild(icon);
    contactContainer.appendChild(anchor);
  }
}