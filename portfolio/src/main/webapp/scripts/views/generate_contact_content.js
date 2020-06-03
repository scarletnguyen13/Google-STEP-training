import { CONTACT } from '../constants.js';

const contactContainer = document.getElementById('contact');

/** 
 * @param {string} url
 * @returns {Element} 
 */
const createAnchor = (url) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = "_blank";
  return anchor;
}

/** 
 * @param {string} type
 * @returns {Element} 
 */
const createSvgIcon = (type) => {
  const icon = document.createElement('img');
  icon.className = 'svg';
  icon.src = `./images/contact-icons/${type}.svg`;
  return icon;
}

for (let type in CONTACT) {
  const anchor = createAnchor(CONTACT[type]);
  const icon = createSvgIcon(type);
  anchor.appendChild(icon);
  contactContainer.appendChild(anchor);
}