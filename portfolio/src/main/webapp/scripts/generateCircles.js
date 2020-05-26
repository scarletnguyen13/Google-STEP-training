const GOOGLE_COLORS = ["#f4c20d", "#4885ed", "#3cba54"] // yellow, blue, green
const ICONS = ["contact", "code", "education", "me", "work", "achievement"];

let currentIndex = ICONS.indexOf("me");

const FULL_CIRCLE_DEGREE = 360;
const SATELLITE_NUMBER = 6;
const RADIUS = 250;
const SATELLITE_RADIUS = 90;

const parentdiv = document.getElementById('parentdiv');

function main() {
  for (let i = 0; i < SATELLITE_NUMBER; i++) {
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
  const color = GOOGLE_COLORS[i % GOOGLE_COLORS.length];
  let childDiv = document.createElement('div');

  childDiv.className = 'div2';
  childDiv.id = "child-" + i;
  childDiv.style.position = 'absolute';
  childDiv.style.top = x;
  childDiv.style.left = y;

  if (i === currentIndex) {
    childDiv.style.backgroundColor = color;
  }
  childDiv.style.border = "solid 3px " + color;

  childDiv.addEventListener("click", function() {
    childDiv.style.backgroundColor = color;
    if (currentIndex !== i) {
      document.getElementById("child-" + currentIndex).style.backgroundColor = "";
      currentIndex = i;
    }
  });

  if (ICONS[i] !== undefined) {
    let icon = document.createElement('img');
    icon.src = '../images/icons/' + ICONS[i] + '-icon.png';
    icon.className = "icon";
    childDiv.appendChild(icon);
  }

  return childDiv;
}

main();