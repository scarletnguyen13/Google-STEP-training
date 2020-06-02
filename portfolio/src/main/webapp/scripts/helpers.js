/**
 * @param {number} radians
 * @param {number} radius
 * @returns {number} 
 */
function getCircleX(radians, radius) {
  return Math.cos(radians) * radius;
}

/**
 * @param {number} radians
 * @param {number} radius
 * @returns {number} 
 */
function getCircleY(radians, radius) {
  return Math.sin(radians) * radius;
}

/** 
 * @param {number} number
 * @returns {string} 
 */
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

/**
 * @param {long} milliseconds
 * @returns {string} 
 */
const convertMillisecondsToLocaleString = (milliseconds) => {
  const date = new Date(milliseconds);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString(
    [], {hour: '2-digit', minute: '2-digit'}
  );
  return `${dateString}<br />${timeString}`;
}

export { 
  getCircleX,
  getCircleY,
  convertNumberToPixelString,
  setContentVisibility,
  convertMillisecondsToLocaleString
}