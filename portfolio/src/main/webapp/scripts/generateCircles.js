const GOOGLE_COLORS = ['#f4c20d', '#4885ed', '#3cba54'] // yellow, blue, green
const ICONS = ['contact', 'code', 'education', 'me', 'work', 'achievement'];

const contents = [];

const menuContainer = document.getElementById('menu-container');

const FULL_CIRCLE_DEGREE = 360;
const SATELLITE_NUMBER = ICONS.length;
const MENU_RADIUS = 250;
const SATELLITE_RADIUS = 90; // as specified in CSS (90px)

const showContent = (contentType) => {
  document.getElementById(contentType).style.display = 'block';
}

const hideContent = (contentType) => {
  document.getElementById(contentType).style.display = 'none';
}

const convertNumberToPixelString = (number) => {
  return number + 'px';
}

const calculateCoordinate = (mathFunc, satelliteIndex) => {
  const div = FULL_CIRCLE_DEGREE / SATELLITE_NUMBER;
  const numb = mathFunc((div * satelliteIndex) * (Math.PI / 180)) * MENU_RADIUS;
  const offsetToParentCenter = parseInt(menuContainer.offsetWidth / 2);
  const offsetToChildCenter = SATELLITE_RADIUS / 2;
  const totalOffset = offsetToParentCenter - offsetToChildCenter;

  return numb + totalOffset;
}

const createIcon = (name) => {
  const icon = document.createElement('img');
  icon.src = '../images/icons/' + name + '-icon.png';
  icon.className = 'icon';
  return icon;
}

const getCoordinates = (satelliteIndex) => {
  return { 
    x: calculateCoordinate(Math.cos, satelliteIndex),
    y: calculateCoordinate(Math.sin, satelliteIndex)
  };
}

function setSatelliteProps(satellite, satelliteIndex) {
  const { x, y } = getCoordinates(satelliteIndex);
  const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
  satellite.className = 'satellite';
  satellite.style.position = 'absolute';
  satellite.style.top = convertNumberToPixelString(x);
  satellite.style.left = convertNumberToPixelString(y);
  satellite.style.border = 'solid 3px ' + color;
}

const createChild = (satelliteIndex) => {
  const childDiv = document.createElement('div');
  setSatelliteProps(childDiv, satelliteIndex);
  
  childDiv.addEventListener('click', function() {
    if (contents.includes(satelliteIndex)) {
      hideContent(ICONS[satelliteIndex]);
      childDiv.style.backgroundColor = '';
      contents.splice(contents.indexOf(satelliteIndex), 1);
    } else {
      showContent(ICONS[satelliteIndex]);
      const color = GOOGLE_COLORS[satelliteIndex % GOOGLE_COLORS.length];
      childDiv.style.backgroundColor = color;
      contents.push(satelliteIndex);
    }
  });

  if (ICONS[satelliteIndex] !== undefined) {
    const icon = createIcon(ICONS[satelliteIndex]);
    childDiv.appendChild(icon);
  }

  return childDiv;
}

export function generateCircles() {
  for (let i = 0; i < SATELLITE_NUMBER; i++) {
    const childDiv = createChild(i);
    menuContainer.appendChild(childDiv);
  }
}