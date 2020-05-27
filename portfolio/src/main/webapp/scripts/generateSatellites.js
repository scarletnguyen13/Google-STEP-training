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

import IconGenerator from './models/IconGenerator.js'; 

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
  const style = {
    width: convertNumberToPixelString(SATELLITE_RADIUS),
    height: convertNumberToPixelString(SATELLITE_RADIUS),
    borderRadius: convertNumberToPixelString(SATELLITE_RADIUS),
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
    const isContentVisible = contents.includes(satelliteIndex);
    if (isContentVisible) {
      toggleContent(ICONS[satelliteIndex], !isContentVisible);
      satellite.style.backgroundColor = '';
      contents.splice(contents.indexOf(satelliteIndex), 1);
    } else {
      toggleContent(ICONS[satelliteIndex], isContentVisible);
      const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
      satellite.style.backgroundColor = color;
      contents.push(satelliteIndex);
    }
  });

  satellite.appendChild(icons[satelliteIndex]);

  return satellite;
}

export function generateSatellites() {
  for (let i = 0; i < NUMBER_OF_SATELLITE; i++) {
    const childDiv = createSatellite(i);
    menuContainer.appendChild(childDiv);
  }
}