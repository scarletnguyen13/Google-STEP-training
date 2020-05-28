/**
 * @param {number} radians
 * @param {number} radius
 */
function getCircleX(radians, radius) {
  return Math.cos(radians) * radius;
}

/**
 * @param {number} radians
 * @param {number} radius
 */
function getCircleY(radians, radius) {
  return Math.sin(radians) * radius;
}

/** @param {number} number */
const convertNumberToPixelString = (number) => {
  return `${number}px`;
}

/**
 * @param {string} elementId
 * @param {boolean} isVisible
 */
const setContentVisibility = (elementId, isVisible) => {
  const displayType = isVisible ? 'block' : 'none';
  document.getElementById(elementId).style.display = displayType;
}

export { 
  getCircleX,
  getCircleY,
  convertNumberToPixelString,
  setContentVisibility
}