const GOOGLE_COLORS = ["#f4c20d", "#4885ed", "#3cba54"] // yellow, blue, green
const ICONS = ["code", "education", "me", "work", "achievement", "contact"];

const FULL_CIRCLE_DEGREE = 360;
const SATELLITE_NUMBER = 6;
const RADIUS = 250;
const SATELLITE_RADIUS = 90;

const parentdiv = document.getElementById('parentdiv');

function main() {
  for (let i = 1; i <= SATELLITE_NUMBER; ++i) {
    childDiv = createChild(i);
    parentdiv.appendChild(childDiv);
  }
}

const getCoordinates = (i) => {
  return { 
    x: calculateCoordinate(Math.cos, i),
    y: calculateCoordinate(Math.sin, i)
  };
}

const calculateCoordinate = (mathFunc, i) => {
  const div = FULL_CIRCLE_DEGREE / SATELLITE_NUMBER;
  const numb = mathFunc((div * i) * (Math.PI / 180)) * RADIUS;
  return convertCoordinateToString(numb);
}

const convertCoordinateToString = (coor) => {
  const offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2); //assumes parent is square
  const offsetToChildCenter = SATELLITE_RADIUS / 2;
  const totalOffset = offsetToParentCenter - offsetToChildCenter;
  return (coor + totalOffset).toString() + "px";
}

const createChild = (i) => {
  const { x, y } = getCoordinates(i);
  let childDiv = document.createElement('div');

  childDiv.className = 'div2';
  childDiv.style.position = 'absolute';
  childDiv.style.top = x;
  childDiv.style.left = y;
  childDiv.style.backgroundColor = GOOGLE_COLORS[i % GOOGLE_COLORS.length];

  if (ICONS[i-1] !== undefined) {
    let icon = document.createElement('img');
    icon.src = '../images/' + ICONS[i-1] + '-icon.png';
    icon.style.width = "50%";
    icon.style.position = 'absolute';
    icon.style.top = "30%";
    icon.style.left = "25%";
    childDiv.appendChild(icon);
  }

  return childDiv;
}

main();