const GOOGLE_COLORS = ["#f4c20d", "#4885ed", "#3cba54"] // yellow, blue, green
const ICONS = ["contact", "code", "education", "me", "work", "achievement"];

let contents = [];

const FULL_CIRCLE_DEGREE = 360;
const SATELLITE_NUMBER = 6;
const RADIUS = 250;
const SATELLITE_RADIUS = 90;

const parentdiv = document.getElementById('parentdiv');

const convertCoordinateToString = (coor) => {
  const offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2); //assumes parent is square
  const offsetToChildCenter = SATELLITE_RADIUS / 2;
  const totalOffset = offsetToParentCenter - offsetToChildCenter;
  return (coor + totalOffset).toString() + "px";
}

const calculateCoordinate = (mathFunc, i) => {
  const div = FULL_CIRCLE_DEGREE / SATELLITE_NUMBER;
  const numb = mathFunc((div * i) * (Math.PI / 180)) * RADIUS;
  return convertCoordinateToString(numb);
}

const createIcon = (name) => {
  const icon = document.createElement('img');
  icon.src = '../images/icons/' + name + '-icon.png';
  icon.className = "icon";
  return icon;
}

const getCoordinates = (i) => {
  return { 
    x: calculateCoordinate(Math.cos, i),
    y: calculateCoordinate(Math.sin, i)
  };
}

function setProps(element, i) {
  const { x, y } = getCoordinates(i);
  const color = GOOGLE_COLORS[i % GOOGLE_COLORS.length];
  element.className = 'div2';
  element.style.position = 'absolute';
  element.style.top = x;
  element.style.left = y;
  element.style.border = "solid 3px " + color;
}

const createChild = (i) => {
  const childDiv = document.createElement('div');
  setProps(childDiv, i);
  
  childDiv.addEventListener("click", function() {
    if (contents.includes(i)) {
      childDiv.style.backgroundColor = "";
      contents.splice(contents.indexOf(i), 1);
    } else {
      const color = GOOGLE_COLORS[i % GOOGLE_COLORS.length];
      childDiv.style.backgroundColor = color;
      contents.push(i);
    }
  });

  if (ICONS[i] !== undefined) {
    const icon = createIcon(ICONS[i]);
    childDiv.appendChild(icon);
  }

  return childDiv;
}

function generateCircles() {
  for (let i = 0; i < SATELLITE_NUMBER; i++) {
    const childDiv = createChild(i);
    parentdiv.appendChild(childDiv);
  }
}

export default generateCircles;