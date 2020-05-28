import { FULL_CIRCLE_DEGREE } from '../constants.js';
import { getCircleX, getCircleY } from '../helpers.js';

class Coordinates {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  
  /**
   * @returns {number} 
   */
  getX() {
    return this.x;
  }

  /**
   * @returns {number} 
   */
  getY() {
    return this.y;
  }

  /**
   * @param {number} i index of current-rendering child
   */
  calculateRandomCoordinates(i) {
    this.x = Math.random() * (i % 2 === 0 ? -11 : 11);
    this.y = Math.random() * 12;
  }

  /**
   * @param {number} i index of current-rendering child
   * @param {object} childInfo
   * @param {number} childInfo.parentOffsetWidth
   * @param {number} childInfo.childOffsetWidth
   * @param {number} childInfo.totalChildren
   * @param {number} childInfo.containerRadius
   */
  calculateCoordinatesAroundCircle(i, childInfo) {
    const { 
      parentOffsetWidth, childOffsetWidth, totalChildren, containerRadius 
    } = childInfo;

    const angleBetweenTwoChildren = FULL_CIRCLE_DEGREE / totalChildren;
    const radians = (angleBetweenTwoChildren * i) * (Math.PI / 180);
    const menuXCoordinate = getCircleX(radians, containerRadius);
    const menuYCoordinate = getCircleY(radians, containerRadius);

    const offsetToParentCenter = parentOffsetWidth / 2;
    const offsetToChildCenter = childOffsetWidth / 2;
    const totalOffset = offsetToParentCenter - offsetToChildCenter;
    
    this.x = menuXCoordinate + totalOffset;
    this.y = menuYCoordinate + totalOffset;
  }
}

export { Coordinates };