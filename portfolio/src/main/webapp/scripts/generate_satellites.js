import { 
  GOOGLE_COLORS, 
  ICONS, 
  FULL_CIRCLE_DEGREE, 
  NUMBER_OF_SATELLITE, 
  MENU_RADIUS, 
  SATELLITE_RADIUS 
} from './constants.js';

import { 
  getCircleX,
  getCircleY,
  convertNumberToPixelString,
  toggleContent
} from './helpers.js';

import { IconGenerator } from './models/icon_generator.js'; 

const contents = [];
const menuContainer = document.getElementById('menu-container');

const iconGenerator = new IconGenerator('50%');
const icons = iconGenerator.generate(ICONS);

const calculateCoordinate = (satelliteIndex) => {
  const angleBetweenTwoSatellites = FULL_CIRCLE_DEGREE / NUMBER_OF_SATELLITE;
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

function setSatelliteProps(satellite, satelliteIndex) {
  const { x, y } = calculateCoordinate(satelliteIndex);
  const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
  satellite.className = 'satellite';
  const pixelizedRadius = convertNumberToPixelString(SATELLITE_RADIUS);
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
}

const createSatellite = (satelliteIndex) => {
  const satellite = document.createElement('div');
  setSatelliteProps(satellite, satelliteIndex);
  
  satellite.addEventListener('click', function() {
    if (contents.includes(satelliteIndex)) {
      toggleContent(ICONS[satelliteIndex], false);
      satellite.style.backgroundColor = '';
      contents.splice(contents.indexOf(satelliteIndex), 1);
    } else {
      toggleContent(ICONS[satelliteIndex], true);
      const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
      satellite.style.backgroundColor = color;
      contents.push(satelliteIndex);
    }
  });

  satellite.appendChild(icons[satelliteIndex]);

  return satellite;
}

for (let i = 0; i < NUMBER_OF_SATELLITE; i++) {
  const childDiv = createSatellite(i);
  menuContainer.appendChild(childDiv);
}