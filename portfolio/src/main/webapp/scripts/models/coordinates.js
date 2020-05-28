import {
  ICONS, 
  FULL_CIRCLE_DEGREE,
  MENU_RADIUS, 
  SATELLITE_RADIUS 
} from '../constants.js';

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

  calculateRandomCoordinates(i) {
    this.x = Math.random() * (i % 2 === 0 ? -11 : 11);
    this.y = Math.random() * 12;
  }

  calculateCoordinatesAroundCircle(parentOffsetWidth, i) {
    const angleBetweenTwoSatellites = FULL_CIRCLE_DEGREE / ICONS.length;
    const radians = (angleBetweenTwoSatellites * i) * (Math.PI / 180);
    const menuXCoordinate = getCircleX(radians, MENU_RADIUS);
    const menuYCoordinate = getCircleY(radians, MENU_RADIUS);

    const offsetToParentCenter = parentOffsetWidth / 2;
    const offsetToChildCenter = SATELLITE_RADIUS / 2;
    const totalOffset = offsetToParentCenter - offsetToChildCenter;
    
    this.x = menuXCoordinate + totalOffset;
    this.y = menuYCoordinate + totalOffset;
  }
}

export { Coordinates };