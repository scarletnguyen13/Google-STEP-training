function getCircleX(radians, radius) {
  return Math.cos(radians) * radius;
}

function getCircleY(radians, radius) {
  return Math.sin(radians) * radius;
}

const convertNumberToPixelString = (number) => {
  return `${number}px`;
}

const toggleContent = (contentType, isVisible) => {
  const displayType = isVisible ? 'block' : 'none';
  document.getElementById(contentType).style.display = displayType;
}

export { 
  getCircleX,
  getCircleY,
  convertNumberToPixelString,
  toggleContent
}