import { 
  GOOGLE_COLORS, 
  ICONS, 
  FULL_CIRCLE_DEGREE,
  MENU_RADIUS, 
  SATELLITE_RADIUS 
} from './constants.js';

import { 
  getCircleX,
  getCircleY,
  convertNumberToPixelString,
  setContentVisibility
} from './helpers.js';

import { IconGenerator } from './models/icon_generator.js'; 

const contents = [];
const menuContainer = document.getElementById('menu-container');

const iconGenerator = new IconGenerator('50%');
const icons = iconGenerator.generate(ICONS);

/**
 * @param {number} satelliteIndex
 * @returns {object} 
 */
const calculateCoordinates = (satelliteIndex) => {
  const angleBetweenTwoSatellites = FULL_CIRCLE_DEGREE / ICONS.length;
  const radians = (angleBetweenTwoSatellites * satelliteIndex) * (Math.PI / 180);
  const menuXCoordinate = getCircleX(radians, MENU_RADIUS);
  const menuYCoordinate = getCircleY(radians, MENU_RADIUS);

  const offsetToMenuCenter = menuContainer.offsetWidth / 2;
  const offsetToSatelliteCenter = SATELLITE_RADIUS / 2;
  const totalOffset = offsetToMenuCenter - offsetToSatelliteCenter;
  
  const x = menuXCoordinate + totalOffset;
  const y = menuYCoordinate + totalOffset;

  return { x, y };
}

/**
 * @param {Element} satellite
 * @param {number} satelliteIndex
 */
function setSatelliteProps(satellite, satelliteIndex) {
  const pixelizedRadius = convertNumberToPixelString(SATELLITE_RADIUS);
  const { x, y } = calculateCoordinates(satelliteIndex);
  const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
  const style = {
    width: pixelizedRadius,
    height: pixelizedRadius,
    borderRadius: pixelizedRadius,
    position: 'absolute',
    top: convertNumberToPixelString(x),
    left: convertNumberToPixelString(y),
    border: `solid 3px ${color}`,
  }
  Object.assign(satellite.style, style);
  satellite.className = 'satellite';
}

/**
 * @param {number} satelliteIndex
 * @returns {Element} 
 */
const createSatellite = (satelliteIndex) => {
  const satellite = document.createElement('div');
  setSatelliteProps(satellite, satelliteIndex);

  satellite.addEventListener('click', () => toggleContent(satellite, satelliteIndex));
  
  satellite.appendChild(icons[satelliteIndex]);
  return satellite;
}

function toggleContent(satellite, satelliteIndex) {
  // if the icon is selected and content is showing
  if (contents.includes(satelliteIndex)) { 
    setContentVisibility(ICONS[satelliteIndex], false); // hide the content
    satellite.style.backgroundColor = ''; // change the icon's background color to none
    contents.splice(contents.indexOf(satelliteIndex), 1); // remove the content from content list
  } else { 
    setContentVisibility(ICONS[satelliteIndex], true); // show the content
    const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
    satellite.style.backgroundColor = color; // change the icon's background color to color
    contents.push(satelliteIndex); // add the content to content list
  }
}

for (let i = 0; i < ICONS.length; i++) {
  const childDiv = createSatellite(i);
  menuContainer.appendChild(childDiv);
}