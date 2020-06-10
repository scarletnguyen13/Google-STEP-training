import { 
  GOOGLE_COLORS, 
  ICONS,
  SATELLITE_RADIUS,
  MENU_RADIUS
} from '../constants.js';

import {
  convertNumberToPixelString,
  setContentVisibility
} from '../helpers.js';

import { IconGenerator } from '../models/icon_generator.js'; 
import { Coordinates } from '../models/coordinates.js'; 

const contents = [];
const menuContainer = document.getElementById('menu-container');

const iconGenerator = new IconGenerator('50%');
const icons = iconGenerator.generate(ICONS);

const satelliteInfo = {
  parentOffsetWidth: menuContainer.offsetWidth,
  childOffsetWidth: SATELLITE_RADIUS,
  totalChildren: ICONS.length,
  containerRadius: MENU_RADIUS
}

/**
 * @param {Element} satellite
 * @param {number} satelliteIndex
 */
function setSatelliteProps(satellite, satelliteIndex) {
  const coordinates = new Coordinates();
  coordinates.calculateCoordinatesAroundCircle(satelliteIndex, satelliteInfo);

  const pixelizedRadius = convertNumberToPixelString(SATELLITE_RADIUS);
  const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];

  const style = {
    width: pixelizedRadius,
    height: pixelizedRadius,
    borderRadius: pixelizedRadius,
    position: 'absolute',
    top: convertNumberToPixelString(coordinates.getX()),
    left: convertNumberToPixelString(coordinates.getY()),
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
    satellite.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.938)';
    contents.splice(contents.indexOf(satelliteIndex), 1); // remove the content from content list
  } else { 
    setContentVisibility(ICONS[satelliteIndex], true); // show the content
    const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
    satellite.style.backgroundColor = color; // change the icon's background color to color
    satellite.style.boxShadow = 'none';
    contents.push(satelliteIndex); // add the content to content list
  }
}

for (let i = 0; i < ICONS.length; i++) {
  const childDiv = createSatellite(i);
  menuContainer.appendChild(childDiv);
}