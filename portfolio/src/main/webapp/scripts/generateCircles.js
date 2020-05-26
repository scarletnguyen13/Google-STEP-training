const GOOGLE_COLORS = ["#3cba54", "#f4c20d", "#4885ed"] // green, yellow, blue

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

  return childDiv;
}

main();