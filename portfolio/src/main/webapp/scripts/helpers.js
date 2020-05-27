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
 * @param {string} contentType
 * @param {boolean} isVisible
 */
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